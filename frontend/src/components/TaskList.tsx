import { DroppableProvided } from "react-beautiful-dnd";

import { ITask } from "../interfaces";
import Task from "./Task";

interface TaskListProps {
  tasks: ITask[];
  provided?: DroppableProvided;
  columnId: number;
}

export default function TaskList({ tasks = [], provided, columnId }: TaskListProps) {
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.droppableProps}
      className='grid gap-2 my-2'
    >
      <>
        {tasks.map((task) => (
          <Task
            key={task.id}
            data={task}
            columnId={columnId}
          />
        ))}
        {provided?.placeholder}
      </>
    </div>
  );
}