import { Droppable } from "react-beautiful-dnd";

import { IColumn } from "../interfaces";
import TaskCard from "./TaskCard";
import { useStoreState } from "~/state/typedHooks";

export default function Column({
  data,
  onTaskClick,
  onEditClick,
  globalIsLoading = false
}: {
  data: IColumn,
  onTaskClick: any,
  onEditClick: any,
  globalIsLoading: boolean
}
) {
  const { tasks } = useStoreState((state) => state);

  return (
    <Droppable droppableId={`column-${data.id}`} type="COLUMN">
      {(provided, snapshot) => (
        <div ref={provided.innerRef} className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-md bg-gray-300" {...provided.droppableProps}>
          <h2 className="text-lg font-semibold mb-4">{data.title}</h2>
          <div className="space-y-4" style={getListStyle(snapshot.isDraggingOver)}>
            {globalIsLoading && 
              <div className="text-center text-gray-400 my-2 mt-4">
                Loading...
              </div>
            }
            {!globalIsLoading && tasks.length === 0 && (
              <div className="text-center text-gray-400 my-2 mt-4">
                No tasks yet. Add a new task to get started.
              </div>
            )}
            {!globalIsLoading && tasks.map((task, index) => task.columnId === data.id ? (
              <TaskCard
                index={index}
                key={task.id}
                data={task}
                onClick={() => onTaskClick(task)}
                onEditClick={() => onEditClick(task)}
              />
            ) : null)}
          </div>
            {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
});