import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";

import Column from "./Column";
import { useStoreState } from "../state/typedHooks";

interface BoardProps {
  className: string;
}

export default function Board({ className }: BoardProps) {
  const { columns, tasks } = useStoreState((state) => state);

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
  }

  return (
    <div id="board" className={`h-[100%] border-2 border-solid border-black grid grid-cols-4 gap-2 m-4 px-4 ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((column) => {
          return (
            <Column key={column.id} data={column} />
          );
        })}
      </DragDropContext>
    </div >
  );
}
