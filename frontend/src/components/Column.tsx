import { Droppable } from "react-beautiful-dnd";

import TaskList from "./TaskList";
import { IColumn } from "../interfaces";

export default function Column({ data }: { data: IColumn }) {
  return (
    <div className="h-[60vh] border-[2px] bg-blue-600 border-solid border-black rounded-[6px] overflow-auto">
      <h4 className="bg-pink-100 p-2 font-[500] text-[1.2rem] text-center ">{data.title}</h4>
      <div className="overflow-auto">
        <Droppable droppableId={data.id.toString()}>
          {provided => (
            <TaskList
              tasks={data.tasks}
              columnId={data.id}
              provided={provided}
            />
          )}
        </Droppable>
      </div>
    </div>
  );
}