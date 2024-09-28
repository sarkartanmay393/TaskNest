import { Action } from "easy-peasy";

export enum TASK_STATUS {
  TODO = "TODO",
  INPROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const ColumnIdByStatus = {
  [TASK_STATUS.TODO]: 1,
  [TASK_STATUS.INPROGRESS]: 2,
  [TASK_STATUS.COMPLETED]: 3,
}

export const StatusByColumnId = {
  1: TASK_STATUS.TODO,
  2: TASK_STATUS.INPROGRESS,
  3: TASK_STATUS.COMPLETED,
}

export interface IPair<T> {
  [key: string]: T;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  columnId: number;
  column?: IColumn;
  userId: number;
  user: unknown;
  createdAt: string;
  updatedAt: string;
  status?: TASK_STATUS;
  hasChanged?: boolean;
}

export interface IColumn {
  id: number;
  title: string;
  tasks: ITask[];
}

export interface IGlobalStore {
  // state variables
  isLoading: boolean;
  error: string;
  tasks: ITask[];
  columns: IColumn[];
  sortBy: string;
  lastSuccessfulSyncAt: string;
  lastSyncStatus: string;

  setSyncInfo: Action<IGlobalStore, { lastSuccessfulSyncAt: string, status: string }>;
  // data fetching
  setIsLoading: Action<IGlobalStore, boolean>;
  setError: Action<IGlobalStore, string>;
  setTasksByColumn: Action<IGlobalStore, { tasks: ITask[], columnId: number }>;
  setTasks: Action<IGlobalStore, ITask[]>;
  setSortBy: Action<IGlobalStore, string>;
  setColumns: Action<IGlobalStore, IColumn[]>;

  // Task management
  // addTask: Action<IGlobalStore, ITask>;
  removeTask: Action<IGlobalStore, ITask>;
  updateTask: Action<IGlobalStore, ITask>;
  changeStatus: Action<IGlobalStore, { status: TASK_STATUS; id: number }>;

  //  utils
}

// export interface IWebWorker {
//   postMessage(data: any): void;
//   addEventListener(type: string, listener: (event: any) => void): void;
//   removeEventListener(type: string, listener: (event: any) => void): void;
// }
