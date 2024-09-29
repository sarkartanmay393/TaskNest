import { Droppable } from "react-beautiful-dnd";

import { IColumn } from "../interfaces";
import TaskCard from "./TaskCard";
import { useStoreState } from "~/state/typedHooks";
import { useMemo } from "react";

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
  const { tasks, isLoading: globalIsLoading } = useStoreState((state) => state);
  const currentTasks = useMemo(() => tasks.filter((task) => task.columnId === data.id), [tasks]);
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

  return (
    <Droppable droppableId={`column-${data.id}`} type="COLUMN">
      {(provided, snapshot) => (
        <div ref={provided.innerRef} className="min-w-[320px] bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-md bg-gray-300" {...provided.droppableProps}>
          <h2 className="text-lg font-semibold mb-4">{data.title}</h2>
          <div className="space-y -4 rounded-lg" style={getListStyle(snapshot.isDraggingOver)}>
            {globalIsLoading &&
              <div className="text-center text-gray-400 my-2 mt-4">
                Loading...
              </div>
            }
            {!globalIsLoading && currentTasks.length === 0 && (
              <div className="text-center text-gray-400 my-2 mt-4">
                No tasks yet. Add a new task to get started.
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

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
});