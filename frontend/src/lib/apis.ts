import { ITask } from "~/interfaces";
import { headers } from "../worker/WebWorker";
import { baseUrl } from "./network";
import { LoginPayload, SignUpPayload } from "./types";

export const logoutApi = async () => {
  try {
    const resp = await fetch(baseUrl + "/api/logout", {
      method: "GET",
      headers: headers,
      credentials: "include",
    });
    if (resp.status !== 200) {
      throw new Error("Failed to logout");
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const signUpApi = async (payload: SignUpPayload) => {
  try {
    const { user, token, error } = await fetch(baseUrl + "/api/signup", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(payload),
    }) as any;
    if (error) {
      throw new Error(error);
    }

    return { user, token };
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export const loginApi = async (payload: LoginPayload) => {
  try {
    const resp = await fetch(baseUrl + "/api/login", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(payload),
    }) as any;
    if (!resp.ok) {
      throw new Error("Failed to login");
    }
    const data = await resp.json();
    return { user: data.user, token: data.token };
  } catch (err: any) {
    throw new Error(err);
  }
};

export const logOutApi = async (navigateTo: any) => {
  try {
    await fetch(baseUrl + "/api/logout", {
      method: "GET",
      headers: headers,
      credentials: "include",
    });
    navigateTo("/login", { replace: true });
  } catch (err) {
    console.error(err);
  }
};

export const createTaskApi = async (task: any) => {
  try {
    await fetch(baseUrl + "/api/task/create", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(task),
    });
  } catch (err) {
    console.error(err);
  }
};

export const updateTaskApi = async (task: any) => {
  try {
    await fetch(baseUrl + "/api/task/update", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(task),
    });
  } catch (err) {
    console.error(err);
  }
};

export const deleteTaskApi = async (taskId: any) => {
  try {
    await fetch(baseUrl + "/api/task/delete", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({ taskId }),
    });
  } catch (err) {
    console.error(err);
  }
};

export const getTasksApi = async ({}: { taskId?: string | number, pagination?: { start: number, count: number }, search?: string, sortBy?: string }) => {
  try {
    const resp = await fetch(baseUrl + "/api/task/get", {
      method: "GET",
      headers: headers,
      credentials: "include",
      // query: {
      //   id: taskId,
      //   sortBy,
      //   search,
      //   pagination: pagination ? JSON.stringify(pagination) : undefined,
      // },
    });
    if (resp.status !== 200) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await resp.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const syncTasksApi = async (payload: {
  tasks: ITask[];
}) => {
  try {
    const formattedTasks = payload.tasks.filter((task => task.new || task.hasChanged)).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      columnId: task.columnId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      new: task.new,
    }));
    const resp = await fetch(baseUrl + "/api/task/bulkUpdate", {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(formattedTasks),
    });
    if (resp.status !== 200) {
      throw new Error("Failed to sync tasks");
    }

    const data = await resp.json();
    return data as { status: string, lastSuccessfulSyncAt: string, createdTasks: ITask[] };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to sync tasks");
  }
};