import { ITask } from "../interfaces";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "./ui/button";
import { useStoreActions } from "~/state/typedHooks";
import { cn } from "~/lib/utils";
// import { useStoreActions } from "../state/typedHooks";

interface TaskProps {
  data: ITask;
  onClick: () => void;
  onEditClick: () => void;
  index: number;
}

export default function TaskCard({ data, onClick, onEditClick, index }: TaskProps) {
  const { removeTask } = useStoreActions((action) => action);

  const handleDelete = () => {
    removeTask(data);
  }

  return (
    <Draggable key={data.id + '_draggable'} draggableId={data.id + '_draggable'} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn("bg-gray-100 p-4 gap-2 min-w-[240px] rounded-lg shadow cursor-move select-none", 
            snapshot.isDragging && "bg-gray-50",
          )}
        >
          <h3 className="font-semibold">{data.title}</h3>
          <p className="text-sm text-gray-600">{data.description.length ? data.description : "No description"}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <p className="hidden sm:flex text-xs text-gray-400 mt-2 flex-1">Updated: {new Date(data.updatedAt).toLocaleString('en-US', { timeStyle: 'short' })}</p>
            <Button variant="outline" size="sm" onClick={onEditClick}>Edit</Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>Delete</Button>
            <Button variant="outline" size="sm" onClick={onClick}>View Details</Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
