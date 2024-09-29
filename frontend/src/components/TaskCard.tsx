import { ITask } from "../interfaces";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "./ui/button";
import { useStoreActions } from "~/state/typedHooks";
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
    <Draggable key={data.id + 'draggable'} draggableId={data.id + 'draggable'} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow cursor-move select-none"
          // style={getItemStyle(
          //   snapshot.isDragging,
          //   provided.draggableProps.style
          // )}
        >
          <h3 className="font-semibold">{data.title}</h3>
          <p className="text-sm text-gray-600">{data.description}</p>
          <p className="text-xs text-gray-400 mt-2">Created at: {data.createdAt}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={onEditClick}>Edit</Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>Delete</Button>
            <Button variant="outline" size="sm" onClick={onClick}>View Details</Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  // ...draggableStyle
});
