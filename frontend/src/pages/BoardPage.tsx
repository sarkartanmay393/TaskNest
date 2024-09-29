import { useEffect, useMemo, useState } from "react";

import { useStoreActions, useStoreState } from "../state/typedHooks";
import { ITask } from "../interfaces";
import { syncTasksApi } from "../lib/apis";

import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import Column from "~/components/Column";
import { AddNewTaskModal, EditTaskModal, TaskModal } from "~/components/Modals";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Toggle } from "~/components/ui/toggle";
import { toast } from "~/hooks/use-toast";
import { Dot } from "lucide-react";
import { columns } from "~/lib/constants";
import { checkDifferences } from "~/lib/utils";

export default function BoardPage({ isAddNewModalOpen, setIsAddNewModalOpen }: { isAddNewModalOpen: boolean, setIsAddNewModalOpen: any }) {
  const { tasks, lastSyncStatus, lastSuccessfulSyncAt, isLoading, requireSyncing, searchTerm, sortBy } = useStoreState((state) => state);
  const { updateTask, setTasks, setIsLoading, setSyncInfo, setRequireSyncing, setSearchTerm, performSearch, setSortBy } = useStoreActions((action) => action);

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  // Handles loading tasks from local storage
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

  // Handles syncing tasks every 5 minutes
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!requireSyncing) {
        return;
      }
      handleSyncClick();
    }, 5 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [])

  const openTaskModal = useMemo(() => (task: ITask) => {
    setSelectedTask(task)
  }, []);

  const closeTaskModal = useMemo(() => () => {
    setSelectedTask(null)
  }, []);

  const openEditModal = useMemo(() => (task: ITask) => {
    setEditingTask(task)
  }, []);

  const closeEditModal = useMemo(() => () => {
    setEditingTask(null)
  }, []);

  const handleEditTask = useMemo(() => () => {  
    closeEditModal()
  }, []);

  const handleSyncClick = useMemo(() => () => {
    toast({
      title: "Syncing tasks...",
      description: "Please wait",
      duration: 5000,
    })
    syncTasksApi({ tasks }).then(({ status, lastSuccessfulSyncAt, allTasks }) => {
      localStorage.removeItem('syncInfo');
      localStorage.removeItem('tasks');
      setSyncInfo({ status, lastSuccessfulSyncAt });
      setTasks(allTasks.map((task) => ({ ...task, hasChanged: false })));
      toast({
        title: "Synced successfully",
        description: "Tasks are now synced",
        duration: 5000,
      })
    }).catch((err) => {
      console.log(err, "err");
      toast({
        title: "Sync failed",
        description: "Please try again",
        duration: 5000,
      })
    }).finally(() => {
      setIsLoading(false);
    });
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const taskId = Number(draggableId.split('_')[0]);
    const destinationColumnId = Number(destination.droppableId.split('-')[1]);

    const exactTask = tasks.find((task) => task.id === taskId);
    if (!exactTask) {
      return;
    }

    updateTask({ taskId, payload: { columnId: destinationColumnId } });
    setRequireSyncing(true);
  };

  const DroppableColumns = useMemo(() => (
    columns.map((column) => (
      <Column
        key={column.id}
        data={column}
        onTaskClick={openTaskModal}
        onEditClick={openEditModal}
      />
    ))), []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-center mb-6">
        <Input
          type="search"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && performSearch()}
          className="max-w-sm"
          disabled={isLoading}
        />
        <div className="flex gap-4 items-center">
          <Toggle disabled={isLoading || !requireSyncing} className="flex border" onClick={handleSyncClick}>
            <Dot className={requireSyncing ? "text-red-500" : "text-green-500"} /> 
            <span className="whitespace-nowrap">Last synced at: {lastSyncStatus ? new Date(lastSuccessfulSyncAt).toLocaleString('en-US', { hour12: true, timeStyle: 'short' }) : 'Never'}</span>
          </Toggle>
          <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
            <SelectTrigger disabled={isLoading} className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Most Recent</SelectItem>
              <SelectItem value="createdAt">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full">
        <DragDropContext onDragEnd={handleDragEnd}>
          {DroppableColumns}
        </DragDropContext>
      </div>
      <TaskModal isOpen={!!selectedTask} onClose={closeTaskModal} task={selectedTask} />
      <EditTaskModal isOpen={!!editingTask} onClose={closeEditModal} task={editingTask} onSave={handleEditTask} />
      <AddNewTaskModal isOpen={isAddNewModalOpen} onClose={() => setIsAddNewModalOpen(false)} />
    </div>
  );
}