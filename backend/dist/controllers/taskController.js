"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = exports.deleteTask = exports.updateTask = exports.createTask = exports.bulkUpdateTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTask = async (req, res) => {
    const { userid } = req.headers;
    const { title, description } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ error: "Missing required field: title" });
        }
        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId: Number(userid),
                columnId: 1,
            }
        });
        return res.json({ createdTask: task });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create task", verbose: JSON.stringify(error) });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { columnId, description, title } = req.body;
    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(id),
                userId: Number(userid),
            },
            data: {
                title,
                description,
                columnId: Number(columnId),
            },
        });
        return res.json({ updatedTask });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Failed to update task", verbose: JSON.stringify(error) });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    try {
        const deletedTask = await prisma.task.delete({
            where: {
                id: Number(id),
                userId: Number(userid),
            }
        });
        return res.json({ deletedTask });
    }
    catch (error) {
        return res.json({ error: "Failed to delete task", verbose: JSON.stringify(error) });
    }
};
exports.deleteTask = deleteTask;
const getAllTasks = async (req, res) => {
    const { userid } = req.headers;
    console.log('userid', userid);
    const { id, search, sortBy, pagination, start, count } = req.query;
    try {
        if (id) {
            const task = await prisma.task.findUnique({
                where: {
                    id: Number(id),
                    userId: Number(userid),
                },
            });
            return res.json({ task });
        }
        else if (pagination === "true") {
            const orderBy = sortBy ? { [sortBy]: "desc" } : undefined;
            const totalTasksCount = await prisma.task.count({
                where: {
                    userId: Number(userid),
                    ...(search && {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }),
                },
            });
            const tasks = await prisma.task.findMany({
                where: {
                    userId: Number(userid),
                    ...(search && {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }),
                },
                take: Number(count),
                skip: Number(start),
                orderBy: [
                    { updatedAt: "desc" },
                    { createdAt: "desc" }
                ],
            });
            return res.json({ tasks, totalTasks: totalTasksCount, start, count });
        }
        else {
            // const orderBy = sortBy ? { [sortBy]: "desc" } : undefined;
            const tasks = await prisma.task.findMany({
                where: {
                    userId: Number(userid),
                    ...(search && {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }),
                },
                orderBy: [
                    { updatedAt: "desc" },
                    { createdAt: "desc" }
                ],
            });
            const columns = await prisma.column.findMany();
            console.log(tasks, 'tasks');
            console.log(columns, 'columns');
            const syncInfo = await prisma.syncInfo.upsert({
                where: {
                    userId: Number(userid),
                },
                create: {
                    userId: Number(userid),
                    lastSuccessfulSyncAt: new Date().toISOString(),
                },
                update: {
                    lastSuccessfulSyncAt: new Date().toISOString(),
                },
            });
            return res.json({ tasks, columns, syncInfo });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to get tasks", verbose: JSON.stringify(err) });
    }
};
exports.getAllTasks = getAllTasks;
const bulkUpdateTasks = async (req, res) => {
    const { userid } = req.headers;
    const tasks = req.body;
    try {
        const createTasks = [];
        const updateTasks = [];
        const deleteTasks = [];
        for (const task of tasks) {
            if (task.new) {
                createTasks.push({
                    title: task.title,
                    description: task.description,
                    columnId: Number(task.columnId),
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt),
                    userId: Number(userid),
                });
            }
            else if (task.isDeleted) {
                deleteTasks.push({
                    id: Number(task.id),
                });
            }
            else {
                updateTasks.push({
                    id: Number(task.id),
                    title: task.title,
                    description: task.description,
                    columnId: Number(task.columnId),
                    updatedAt: new Date(task.updatedAt),
                });
            }
        }
        let updatedTasks = [];
        let createdTasks;
        let deletedTasks;
        if (updateTasks.length > 0) {
            updatedTasks = await Promise.all(updateTasks.map(async (task) => {
                return await prisma.task.update({
                    where: { id: task.id },
                    data: {
                        title: task.title,
                        description: task.description,
                        columnId: task.columnId,
                        updatedAt: task.updatedAt,
                    },
                });
            }));
        }
        if (createTasks.length > 0) {
            createdTasks = await prisma.task.createMany({
                data: createTasks,
            });
        }
        if (deleteTasks.length > 0) {
            deletedTasks = await prisma.task.deleteMany({
                where: {
                    id: {
                        in: deleteTasks.map((task) => task.id),
                    },
                },
            });
        }
        const allTasks = await prisma.task.findMany({
            where: {
                userId: Number(userid),
            },
        });
        const syncInfo = await prisma.syncInfo.upsert({
            where: {
                userId: Number(userid),
            },
            create: {
                userId: Number(userid),
                lastSuccessfulSyncAt: new Date().toISOString(),
            },
            update: {
                lastSuccessfulSyncAt: new Date().toISOString(),
            },
        });
        return res.json({ syncInfo, createdTasks, updatedTasks, allTasks, lastSuccessfulSyncAt: new Date().toISOString(), status: "success" });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Failed to update tasks", verbose: JSON.stringify(error), status: "failed", lastSuccessfulSyncAt: new Date("1963-01-01").toISOString() });
    }
};
exports.bulkUpdateTasks = bulkUpdateTasks;
