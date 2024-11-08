import { IGlobalStore, ITask } from "../interfaces";
import { action } from "easy-peasy";

const globalStore: IGlobalStore = {
  isLoading: false,
  error: "",
  tasks: [],
  sortBy: "updatedAt",
  lastSuccessfulSyncAt: "",
  lastSyncStatus: "success",
  searchTerm: "",
  wholeTaskList: [],
  requireSyncing: true,

  setRequireSyncing: action((state, payload) => {
    state.requireSyncing = payload;
    const syncInfo = JSON.parse(localStorage.getItem('syncInfo') || '{}');
    localStorage.setItem('syncInfo', JSON.stringify({ ...syncInfo, requireSyncing: payload }));
  }),

  // TODO: remove this in the future
  performSearch: action((state) => {
    state.isLoading = true;
    if (state.searchTerm === "") {
      state.tasks = state.wholeTaskList;
      state.isLoading = false;
      return;
    }
    state.tasks = state.wholeTaskList.filter((task) => task.title.toLowerCase().includes(state.searchTerm.toLowerCase()));
    state.isLoading = false;
  }),

  setSearchTerm: action((state, payload) => {
    state.isLoading = true;
    state.searchTerm = payload;
    if (payload === "") {
      state.tasks = state.wholeTaskList;
      state.isLoading = false;
      return;
    }
    state.tasks = state.wholeTaskList.filter((task) => task.title.toLowerCase().includes(state.searchTerm.toLowerCase()));
    state.isLoading = false;
  }),

  setSyncInfo: action((state, payload) => {
    state.lastSuccessfulSyncAt = payload.lastSuccessfulSyncAt;
    state.lastSyncStatus = payload.status;
    state.requireSyncing = payload.requireSyncing ?? false;
    localStorage.setItem('syncInfo', JSON.stringify({ ...payload, requireSyncing: payload.requireSyncing ?? false }));
  }),

  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),

  setTasks: action((state, payload: ITask[]) => {
    state.tasks = payload;
    state.wholeTaskList = payload;
  }),

  removeTask: action((state, payload: ITask) => {
    state.tasks = state.tasks.map((task) => {
      if (task.id === payload.id) {
        state.requireSyncing = true;
        return {
          ...task,
          ...payload,
          isDeleted: true,
        };
      }
      return task;
    });
  }),

  updateTask: action((state, payload: { taskId: string | number, payload: Partial<ITask> }) => {
    state.tasks = state.tasks.map((task) => {
      if (task.id === payload.taskId) {
        state.requireSyncing = true;
        return {
          ...task,
          ...payload.payload,
        };
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
};

export default globalStore;

// Mock function to simulate API call
// const fetchTasksFromApi = async (): Promise<ITask[]> => {
//   return [
//     {
//       id: 1, title: "Task 1", description: "Description 1", status: TASK_STATUS.TODO, columnId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
//       userId: 0,
//       user: undefined
//     },
//     {
//       id: 2, title: "Task 2", description: "Description 2", status: TASK_STATUS.TODO, columnId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
//       userId: 0,
//       user: undefined
//     }
//   ];
// };
