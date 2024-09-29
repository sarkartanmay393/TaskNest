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
  hasChanged?: boolean;
  new?: boolean;
}

export interface IColumn {
  id: number;
  title: string;
  tasks: ITask[];
}

export interface IGlobalStore {
  // state variables
  requireSyncing: boolean;
  isLoading: boolean;
  error: string;
  tasks: ITask[];
  sortBy: string;
  lastSuccessfulSyncAt: string;
  lastSyncStatus: string;
  searchTerm: string;
  wholeTaskList: ITask[];

  setRequireSyncing: Action<IGlobalStore, boolean>;
  setSearchTerm: Action<IGlobalStore, string>;
  setSyncInfo: Action<IGlobalStore, { lastSuccessfulSyncAt: string, status: string }>;
  // data fetching
  setIsLoading: Action<IGlobalStore, boolean>;
  setError: Action<IGlobalStore, string>;
  setTasks: Action<IGlobalStore, ITask[]>;
  setSortBy: Action<IGlobalStore, string>;

  // Task management
  removeTask: Action<IGlobalStore, ITask>;
  updateTask: Action<IGlobalStore, { taskId: string | number, payload: Partial<ITask> }>;
  performSearch: Action<IGlobalStore>;

  //  utils
}

// export interface IWebWorker {
//   postMessage(data: any): void;
//   addEventListener(type: string, listener: (event: any) => void): void;
//   removeEventListener(type: string, listener: (event: any) => void): void;
// }
