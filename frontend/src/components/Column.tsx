import { Droppable } from "react-beautiful-dnd";

import { IColumn } from "../interfaces";
import TaskCard from "./TaskCard";
import { useStoreState } from "~/state/typedHooks";

export default function Column({
  data,
  onTaskClick,
  onEditClick
}: {
  data: IColumn,
  onTaskClick: any,
  onEditClick: any
}
) {
  const { tasks } = useStoreState((state) => state);

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{data.title}</h2>
      <Droppable droppableId={data.id.toString()}>
        {(provided) => (
          <div className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                data={task}
                onClick={() => onTaskClick(task)}
                onEditClick={() => onEditClick(task)}
              />
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
}