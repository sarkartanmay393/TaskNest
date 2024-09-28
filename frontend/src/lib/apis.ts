import { headers } from "../worker/WebWorker";
import { baseUrl } from "./network";

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

export const getTasksApi = async ({  }: { taskId?: string | number, pagination?: { start: number, count: number }, search?: string, sortBy?: string }) => {
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
    return { tasks: data.tasks };
  } catch (err) {
    console.error(err);
  }
};