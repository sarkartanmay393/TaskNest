import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ITask } from "~/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkDifferences = (storedTasks: ITask[], currentTasks: ITask[]): boolean => {
  if (storedTasks.length !== currentTasks.length) {
    return true;
  }

  const storedTasksMap = new Map(storedTasks.map(task => [task.id, task]));
  for (const task of currentTasks) {
    const storedTask = storedTasksMap.get(task.id);
    if (!storedTask || JSON.stringify(storedTask) !== JSON.stringify(task)) {
      return true;
    }
  }

  return false;
};