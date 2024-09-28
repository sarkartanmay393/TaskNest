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
    const c1Tasks = payload.filter((task) => task.columnId === 1);
    const c2Tasks = payload.filter((task) => task.columnId === 2);
    const c3Tasks = payload.filter((task) => task.columnId === 3);
    state.columns = [
      {
        id: 1,
        title: "TODO",
        tasks: c1Tasks,
      },
      {
        id: 2,
        title: "IN PROGRESS",
        tasks: c2Tasks,
      },
      {
        id: 3,
        title: "COMPLETED",
        tasks: c3Tasks,
      },
    ];
  }),

  setTasksByColumn: action((state, payload: { tasks: ITask[], columnId: number }) => {
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
    const filteredColumns = state.columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== playload.id),
      };
    });
    state.tasks = filteredTasks
    state.columns = filteredColumns
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
