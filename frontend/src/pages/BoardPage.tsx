import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Board from "../components/Board";
import { useStoreActions, useStoreState } from "../state/typedHooks";
import { ITask, TASK_STATUS } from "../interfaces";
import Loading from "../components/Loading";
import { getTasksApi, logOutApi } from "../lib/apis";

export default function BoardPage() {
  const navigateTo = useNavigate();
  const { isLoading, tasks, columns } = useStoreState((state) => state);
  const { addTask, setTasks, setIsLoading, setColumns } =
    useStoreActions((action) => action);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { tasks, columns } = await getTasksApi({}) as any;

        setTasks(tasks);
        setColumns(columns);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleNewTask = async () => {
    let defaultTask: ITask = {
      id: tasks.length + 1,
      title: "",
      description: "",
      status: TASK_STATUS.TODO,
      columnId: 1,
      userId: JSON.parse(sessionStorage.getItem("user") ?? '').id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      column: columns.find((column) => column.id === 1)!,
      user: undefined
    };

    addTask(defaultTask);
  };

  const handleLogout = () => {
    logOutApi(navigateTo);
  };

  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] bg-gray-100">
      <img
        alt=""
        width={24}
        onClick={handleGoBack}
        className="absolute left-8 top-6 cursor-pointer"
        src="https://cdn1.iconfinder.com/data/icons/duotone-essentials/24/chevron_backward-512.png" />
      <div className="flex flex-col items-center w-[100%] h-[100%] ">
        <img
          className="absolute right-8 top-6 cursor-pointer"
          width={24}
          alt=""
          onClick={handleLogout}
          src="https://www.svgrepo.com/show/135250/logout.svg"
        />
        <h3 className="text-[2.4rem] font-[500] ">Personal Board</h3>
        <p className="text-[1rem] font-[500] ">
          Manage your daily/weekly tasks here.
        </p>
        <img
          onClick={handleNewTask}
          className="border-[0.1px] border-solid border-gray-400 rounded-[6px] my-4 cursor-pointer p-1"
          width={36}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png"
          alt=""
          style={{ boxShadow: "1px 0.4px 4px 0.3px lightgreen" }}
        />
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <Board className="" />
        )}
      </div>
    </div>
  );
}