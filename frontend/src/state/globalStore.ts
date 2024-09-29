import { IGlobalStore, ITask, TASK_STATUS } from "../interfaces";
import { action } from "easy-peasy";

const globalStore: IGlobalStore = {
  isLoading: true,
  error: "",
  tasks: [],
  columns: [],
  sortBy: "updatedAt",
  lastSuccessfulSyncAt: "",
  lastSyncStatus: "success",
  searchTerm: "",
  wholeTaskList: [],

  setSearchTerm: action((state, payload) => {
    state.searchTerm = payload;
    if (payload === "") {
      state.tasks = state.wholeTaskList;
      return;
    }
    state.tasks = state.tasks.filter((task) => task.title.toLowerCase().includes(payload.toLowerCase()));
  }),

  setSyncInfo: action((state, payload) => {
    state.lastSuccessfulSyncAt = payload.lastSuccessfulSyncAt;
    state.lastSyncStatus = payload.status;
    localStorage.setItem('syncInfo', JSON.stringify(payload));
  }),

  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),

  setTasks: action((state, payload: ITask[]) => {
    state.tasks = payload;
    state.wholeTaskList = payload;
  }),

  setTasksByColumn: action((state, payload: { tasks: ITask[]; columnId: number; }) => {
    const { tasks, columnId } = payload;
    state.tasks = state.tasks.concat(tasks);
    state.columns = state.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.concat(tasks),
        };
      }
      return column;
    });
  }),

  removeTask: action((state, playload: ITask) => {
    const filteredTasks = state.tasks.filter((task) => task.id !== playload.id);
    state.tasks = filteredTasks;
    state.wholeTaskList = filteredTasks;
  }),

  changeStatus: action((state, payload: { status: TASK_STATUS; id: number; }) => {
    state.tasks = state.tasks.map((task) => {
      if (task.id === payload.id) {
        return {
          ...task,
          status: payload.status,
        };
      }
      return task;
    });

    let columnId: number;
    if (payload.status === TASK_STATUS.TODO) {
      columnId = 1;
    } else if (payload.status === TASK_STATUS.INPROGRESS) {
      columnId = 2;
    } else if (payload.status === TASK_STATUS.COMPLETED) {
      columnId = 3;
    }


    state.columns = state.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === payload.id) {
              return {
                ...task,
                status: payload.status,
              };
            }
            return task;
          }),
        };
      }
      return column;
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
  })
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
