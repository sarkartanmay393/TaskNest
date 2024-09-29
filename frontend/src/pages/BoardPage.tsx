import { useEffect, useState } from "react";

import { useStoreActions, useStoreState } from "../state/typedHooks";
import { IColumn, ITask } from "../interfaces";
import { getTasksApi, syncTasksApi } from "../lib/apis";

import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import Column from "~/components/Column";
import { AddNewTaskModal, EditTaskModal, TaskModal } from "~/components/Modals";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Toggle } from "~/components/ui/toggle";
import { toast } from "~/hooks/use-toast";

const columns: IColumn[] = [
  {
    "id": 1,
    "title": "TODO",
    tasks: []
  },
  {
    "id": 2,
    "title": "IN PROGRESS",
    tasks: []
  },
  {
    "id": 3,
    "title": "COMPLETED",
    tasks: []
  }
];

const checkDifferences = (storedTasks: ITask[], currentTasks: ITask[]): boolean => {
  if (storedTasks.length !== currentTasks.length) {
    return true;
  }

  const storedTasksMap = new Map(storedTasks.map(task => [task.id, task]));
  for (const task of currentTasks) {
    const storedTask = storedTasksMap.get(task.id);
    if (!storedTask || JSON.stringify(storedTask) !== JSON.stringify(task)) {
      return true;
    }
  }

  return false;
};

export default function BoardPage({ isAddNewModalOpen, setIsAddNewModalOpen }: { isAddNewModalOpen: boolean, setIsAddNewModalOpen: any }) {
  const { tasks, lastSyncStatus, lastSuccessfulSyncAt, isLoading } = useStoreState((state) => state);
  const { setTasks, setIsLoading, setSyncInfo } =
    useStoreActions((action) => action);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { tasks } = await getTasksApi({}) as any;
        setTasks(tasks.map((task: any) => ({ ...task, hasChanged: false })));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const tasksLS = localStorage.getItem('tasks');
    if (tasksLS && tasksLS !== '[]' && tasksLS !== "undefined" && tasksLS !== null) {
      const tasksLSParsed = JSON.parse(tasksLS);
      if (checkDifferences(tasksLSParsed, tasks)) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    } else {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    console.log('tasks saved on local storage');
  }, [tasks]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const { status, lastSuccessfulSyncAt, createdTasks } = await syncTasksApi({ tasks });
      console.log({ status, lastSuccessfulSyncAt, createdTasks });
      localStorage.removeItem('syncInfo');
      localStorage.removeItem('tasks');
      setSyncInfo({ status, lastSuccessfulSyncAt });
      setTasks(tasks.filter((task) => !createdTasks.some((createdTask) => createdTask.id === task.id)).concat(createdTasks).map((task) => ({ ...task, hasChanged: false })));
    }, 5 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [])

  const openTaskModal = (task: ITask) => {
    setSelectedTask(task)
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
  }

  const openEditModal = (task: ITask) => {
    console.log(task)
    setEditingTask(task)
  }

  const closeEditModal = () => {
    setEditingTask(null)
  }

  const handleEditTask = () => {
    closeEditModal()
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Perform the reordering logic here

    console.log(`From column: ${source.droppableId}, to column: ${destination.droppableId}, draggableId: ${draggableId}`);
  };

  const handleSyncClick = () => {
    toast({
      title: "Syncing tasks...",
      description: "Please wait",
      duration: 5000,
    })
    syncTasksApi({ tasks }).then(({ status, lastSuccessfulSyncAt, createdTasks }) => {
      localStorage.removeItem('syncInfo');
      localStorage.removeItem('tasks');
      setSyncInfo({ status, lastSuccessfulSyncAt });
      setTasks(tasks.filter((task) => !createdTasks.some((createdTask) => createdTask.id === task.id)).concat(createdTasks).map((task) => ({ ...task, hasChanged: false })));
      toast({
        title: "Synced successfully",
        description: "Tasks are now synced",
        duration: 5000,
      })
    }).catch((err) => {
      console.log(err);
      toast({
        title: "Sync failed",
        description: "Please try again",
        duration: 5000,
      })
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between gap-2 items-center mb-6">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
        <div className="flex gap-4 items-center">
          <Toggle disabled={isLoading} className="flex gap-1 border" onClick={handleSyncClick}>
            Last synced at: {lastSyncStatus ? new Date(lastSuccessfulSyncAt).toLocaleString() : 'Never'}
          </Toggle>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger disabled={isLoading} className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column
              key={column.id}
              data={column}
              onTaskClick={openTaskModal}
              onEditClick={openEditModal}
              globalIsLoading={isLoading}
            />
          ))}
        </DragDropContext>
      </div>
      <TaskModal isOpen={!!selectedTask} onClose={closeTaskModal} task={selectedTask} />
      <EditTaskModal isOpen={!!editingTask} onClose={closeEditModal} task={editingTask} onSave={handleEditTask} />
      <AddNewTaskModal isOpen={isAddNewModalOpen} onClose={() => setIsAddNewModalOpen(false)} />
    </div>
  );
}