import { Droppable } from "react-beautiful-dnd";

import { IColumn } from "../interfaces";
import TaskCard from "./TaskCard";
import { useStoreActions, useStoreState } from "~/state/typedHooks";
import { useMemo } from "react";
import { cn } from "~/lib/utils";

export default function Column({
  data,
  onTaskClick,
  onEditClick
}: {
  data: IColumn,
  onTaskClick: any,
  onEditClick: any,
}
) {
  const { tasks, isLoading: globalIsLoading, sortBy, searchTerm } = useStoreState((state) => state);
  const { setIsLoading } = useStoreActions((action) => action);

  const currentTasks = useMemo(() => {
    setIsLoading(true);
    const calcTasks = tasks.filter((task) => task.columnId === data.id && task.isDeleted !== true).sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
    setIsLoading(false);
    return calcTasks;
  }, [tasks, data.id, sortBy]);

  const TaskList = useMemo(() =>
    currentTasks.map((task, index) => (
      <TaskCard
        index={index}
        key={task.id}
        data={task}
        onClick={() => onTaskClick(task)}
        onEditClick={() => onEditClick(task)}
      />
    )), [currentTasks]);

    console.log(currentTasks);

  return (
    <Droppable droppableId={`column-${data.id}`} type="COLUMN">
      {(provided, snapshot) => (
        <div ref={provided.innerRef} className="transition-height duration-300 ease-in-out h-min p-4 rounded-lg border border-gray-300 shadow-sm bg-gray-300" {...provided.droppableProps}>
          <h2 className="text-lg font-semibold mb-4">{data.title}</h2>
          <div className={cn("max-h-[60vh] space-y-2 rounded-lg overflow-y-auto", snapshot.isDraggingOver && "bg-gray-300")}>
            {globalIsLoading &&
              <div className="text-center text-gray-400 my-2 mt-4">
                Loading...
              </div>
            }
            {!globalIsLoading && currentTasks.length === 0 && (
              <div className="text-center text-gray-400 my-2 mt-4">
                {searchTerm.length > 0 ? "No task found!" : "No tasks yet. Add a new task to get started."}
              </div>
            )}
            {!globalIsLoading && TaskList}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}