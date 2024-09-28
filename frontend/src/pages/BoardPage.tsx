import { useEffect, useState } from "react";

import { useStoreActions } from "../state/typedHooks";
import { IColumn, ITask } from "../interfaces";
import { getTasksApi } from "../lib/apis";

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { PlusIcon } from 'lucide-react'
import Column from "~/components/Column";
import { AddNewTaskModal, EditTaskModal, TaskModal } from "~/components/Modals";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

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

export default function BoardPage() {
  // useStoreState((state) => state);
  const { setTasks, setIsLoading } =
    useStoreActions((action) => action);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('recent');
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [editingTask, setEditingTask] = useState<ITask | null>(null);
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { tasks } = await getTasksApi({}) as any;
        setTasks(tasks);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      
    }, 5000);

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
    // setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
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
  
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-blue-600">Task Manager</div>
        <Button onClick={() => setIsAddNewModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </header>
      <div className="flex justify-between gap-2 items-center mb-6">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column
              key={column.id}
              data={column}
              onTaskClick={openTaskModal}
              onEditClick={openEditModal}
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