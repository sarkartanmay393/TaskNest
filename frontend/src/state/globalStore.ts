import { IGlobalStore, ITask, TASK_STATUS } from "../interfaces";
import { action, thunk } from "easy-peasy";

const globalStore: IGlobalStore = {
  isLoading: true,
  error: "",
  tasks: [],
  columns: [],
  sortBy: "updatedAt",

  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),

  setTasks: action((state, payload: ITask[]) => {
    state.tasks = payload;
  }),

  addTask: action((state, payload: ITask) => {
    console.log(payload, 'payload');
    state.tasks = [...state.tasks, payload];
  }),

  removeTask: action((state, playload: ITask) => {
    const filteredTasks = state.tasks.filter((task) => task.id !== playload.id);
    state.tasks = filteredTasks;
  }),

  changeStatus: action((state, payload: { status: TASK_STATUS; id: number }) => {
    state.tasks = state.tasks.map((task) => {
      if (task.id === payload.id) {
        return {
          ...task,
          status: payload.status,
        };
      }
      return task;
    });
  }),

  updateTask: action((state, payload: ITask) => {
    state.tasks = state.tasks.map((task) => {
      if (task.id === payload.id) {
        return payload;
      }
      return task;
    });
  }),

  setError: action((state, payload) => {
    state.error = payload;
  }),

  setSortBy: action((state, payload) => {
    state.sortBy = payload;
  }),
  
  setColumns: action((state, payload) => {
    state.columns = payload;
  }),
  
  // initializeStore: thunk(async (actions) => {
  //   actions.setIsLoading(true);
  //   try {
  //     const tasks = await fetchTasksFromApi();
  //     actions.setTasks(tasks);
  //   } catch (error) {
  //     actions.setError(error.message);
  //   } finally {
  //     actions.setIsLoading(false);
  //   }
  // }),

  // cleanupStore: action((state) => {
  //   console.log("Cleaning up store");
    // state.isLoading = false;
    // state.error = "";
    // state.tasks = [];
    // state.columns = [];
    // state.sortBy = "updatedAt";
  // }),
};

export default globalStore;

// Mock function to simulate API call
const fetchTasksFromApi = async (): Promise<ITask[]> => {
  return [
    {
      id: 1, title: "Task 1", description: "Description 1", status: TASK_STATUS.TODO, columnId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      userId: 0,
      user: undefined
    },
    {
      id: 2, title: "Task 2", description: "Description 2", status: TASK_STATUS.TODO, columnId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      userId: 0,
      user: undefined
    }
  ];
};
