import { ChangeEvent } from "react";

import { useStoreActions } from "../state/typedHooks";
import { ITask, TASK_STATUS } from "../interfaces";
import { Draggable } from "react-beautiful-dnd";

interface TaskProps {
  data: ITask;
  columnId: number;
}

export default function Task({ data, columnId }: TaskProps) {
  const { updateTask, removeTask, changeStatus } = useStoreActions((action) => action);

  const handleChange = async (
    e:
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (e.target.name === "status") {
      changeStatus({ status: e.target.value as TASK_STATUS, id: data.id });
      return;
    } else {
      const updatedTask = {
        ...data,
        [e.target.name]: e.target.value,
      };
      updateTask(updatedTask);
    }
  };

  const handleDelete = async () => {
  };

  // TODO: send update req after focus leave from task component
  // const thisEl = document.getElementById(data.id);
  // if (thisEl) {
  //   thisEl.onfocus = (event) => {
  //     console.log('focus')
  //   }
  // }

  return (
    <Draggable draggableId={data.id.toString()} index={columnId}>
      {(provided) => (
        <div
          id={`${data.id}`}
          ref={provided.innerRef}
          className="flex flex-col gap-2 bg-blue-100 rounded-[6px] mx-4 p-2 border border-black "
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img
            onClick={handleDelete}
            className="relative md:self-end border-[2px] border-solid border-solid rounded-[6px] mt-2 cursor-pointer "
            width={20}
            src="https://www.svgrepo.com/show/21045/delete-button.svg"
            alt=""
          />

          <div className="grid mt-[-10%]">
            <input
              name="title"
              placeholder="Implement User Auth"
              className="focus:outline-0 focus:bg-pink-100 text-[1rem] lg:text-[1.1rem] font-[600] bg-transparent rounded-[6px] p-2 "
              value={data.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Use next-auth or passport.js and go through docs"
              className="focus:outline-0 focus:bg-pink-100 text-[0.8rem] lg:text-[0.9rem] bg-transparent rounded-[6px] p-2 "
              value={data.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 justify-start items-center ">
            <div className="border border-black p-1 gap-1 flex items-center justify-center self-start rounded-[6px] min-w-[72px] h-[28px] bg-white text-[0.8rem]">
              <select
                name="status"
                className="w-[100%] h-[100%] bg-transparent text-[0.8rem] font-[500] rounded-[6px]"
                value={data.status}
                onChange={handleChange}
              >
                {Object.values(TASK_STATUS).map((status: string) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
