import { ITask } from "../interfaces";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "./ui/button";
// import { useStoreActions } from "../state/typedHooks";

interface TaskProps {
  data: ITask;
  columnId: number;
  onClick: () => void;
  onEditClick: () => void
}

export default function TaskCard({ data, columnId, onClick, onEditClick }: TaskProps) {
  // const { updateTask, removeTask, changeStatus } = useStoreActions((action) => action);

  return (
    <Draggable draggableId={data.id.toString()} index={columnId}>
      {() => (
        <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">{data.title}</h3>
        <p className="text-sm text-gray-600">{data.description}</p>
        <p className="text-xs text-gray-400 mt-2">Created at: {data.createdAt}</p>
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm" onClick={onEditClick}>Edit</Button>
          <Button variant="outline" size="sm">Delete</Button>
          <Button variant="outline" size="sm" onClick={onClick}>View Details</Button>
        </div>
      </div>
      )}
    </Draggable>
  );
}
