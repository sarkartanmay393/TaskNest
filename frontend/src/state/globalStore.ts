import { IGlobalStore, ITask, TASK_STATUS } from "../interfaces";
import { action } from "easy-peasy";

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
};

export default globalStore;
