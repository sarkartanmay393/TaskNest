import { PrismaClient } from "@prisma/client";
import { ReqTypeArrayBody, type ReqType, type ResType } from "../types/index";

const prisma = new PrismaClient();

const createTask = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers as { userid: string };
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to create task", verbose: JSON.stringify(error) });
  }
};

const updateTask = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers as { userid: string };
  const { id }  = req.params as unknown as { id: string };
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
  } catch (error) {
    console.log(error);
    return res.json({ error: "Failed to update task", verbose: JSON.stringify(error) });
  }
};

const deleteTask = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers as { userid: string };
  const { id } = req.params as unknown as { id: string };

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(id), 
        userId: Number(userid),
      }
    });

    return res.json({ deletedTask });
  } catch (error) {
    return res.json({ error: "Failed to delete task", verbose: JSON.stringify(error) });
  }
};

const getAllTasks = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers as { userid: string };
  const { id, search, sortBy, pagination, start, count } = req.query as unknown as { id?: string, search?: string, sortBy?: string, pagination?: string, start?: string, count?: string };
  try {
    if (id) {
      const task = await prisma.task.findUnique({
        where: {
          id: Number(id),
          userId: Number(userid),
        },
      });
      return res.json({ task });
    } else if (pagination === "true") {
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
    } else {
      const orderBy = sortBy ? { [sortBy]: "desc" } : undefined;
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

      return res.json({ tasks, columns });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to get tasks", verbose: JSON.stringify(err) });
  }
};

export const bulkUpdateTasks = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers as { userid: string };
  const { tasks = [] } = req.body as unknown as { tasks: any[] };

  try {
    const createTasks: any[] = [];
    const updateTasks: any[] = [];

    for (const task of tasks) {
      if (task.id) {
        updateTasks.push({
          id: Number(task.id),
          title: task.title,
          description: task.description,
          columnId: Number(task.columnId),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          userId: Number(userid),
        });
      } else {
        createTasks.push({
            title: task.title,
            description: task.description,
            columnId: Number(task.columnId),
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            userId: Number(userid),
        });
      }
    }

    const updatedTasks = await prisma.task.updateMany({
      where: { id: { in: updateTasks.map((task) => task.id) } },
      data: updateTask,
    });
    
    const createdTasks = await prisma.task.createManyAndReturn({
      data: createTasks,
    });
    return res.json({ createdTasks, updatedTasks, lastSuccessfulSyncAt: new Date().toISOString(), status: "success" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Failed to update tasks", verbose: JSON.stringify(error), status: "failed", lastSuccessfulSyncAt: new Date("1963-01-01").toISOString() });
  }
};

export { createTask, updateTask, deleteTask, getAllTasks };


