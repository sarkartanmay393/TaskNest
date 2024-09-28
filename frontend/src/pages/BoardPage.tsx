import { useEffect, useState } from "react";

import { useStoreActions, useStoreState } from "../state/typedHooks";
import { ITask, TASK_STATUS } from "../interfaces";
import { getTasksApi } from "../lib/apis";


import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { PlusIcon } from 'lucide-react'
import Column from "~/components/Column";
import { AddNewTaskModal, EditTaskModal, TaskModal } from "~/components/Modals";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";


// Mock data
const initialTasks: ITask[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1', status: TASK_STATUS.TODO, createdAt: '2023/05/01 09:00:00',
    columnId: 1,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
  {
    id: 2, title: 'Task 2', description: 'Description 2', status: TASK_STATUS.TODO, createdAt: '2023/05/02 10:30:00',
    columnId: 1,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
  {
    id: 3, title: 'Task 3', description: 'Description 3', status: TASK_STATUS.TODO, createdAt: '2023/05/03 11:45:00',
    columnId: 1,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
  {
    id: 4, title: 'Task 4', description: 'Description 4', status: TASK_STATUS.INPROGRESS, createdAt: '2023/05/04 14:15:00',
    columnId: 2,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
  {
    id: 5, title: 'Task 5', description: 'Description 5', status: TASK_STATUS.INPROGRESS, createdAt: '2023/05/05 16:30:00',
    columnId: 2,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
  {
    id: 6, title: 'Task 6', description: 'Description 6', status: TASK_STATUS.COMPLETED, createdAt: '2023/05/06 18:00:00',
    columnId: 3,
    column: undefined,
    userId: 0,
    user: undefined,
    updatedAt: ""
  },
]

export default function BoardPage() {
  const { isLoading, tasks, columns } = useStoreState((state) => state);
  const { addTask, setTasks, setIsLoading, setColumns } =
    useStoreActions((action) => action);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { tasks, columns } = await getTasksApi({}) as any;
        setTasks(initialTasks);
        setColumns(columns);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false)

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
  })

  const addNewTask = (newTask: Omit<ITask, 'id' | 'createdAt'>) => {
    const task: ITask = {
      ...newTask,
      id: tasks.length + 1,
      createdAt: new Date().toISOString(),
    }
    // setTasks([...tasks, task])
    setIsAddNewModalOpen(false)
  }

  const openTaskModal = (task: ITask) => {
    setSelectedTask(task)
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
  }

  const openEditModal = (task: ITask) => {
    setEditingTask({ ...task })
  }

  const closeEditModal = () => {
    setEditingTask(null)
  }

  const handleEditTask = (updatedTask: ITask) => {
    // setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    closeEditModal()
  }

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    // const { destination, source, draggableId } = result;

    // if (!destination) {
    //   return;
    // }

    // if (source.droppableId === destination.droppableId) {
    //   const tasks = reorder(
    //     tasks,
    //     result.source.index,
    //     result.destination.index
    //   );

    //   setTasks(tasks);
    // }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-blue-600">Task Manager</div>
        <Button onClick={() => setIsAddNewModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </header>
      <div className="flex justify-between items-center mb-6">
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
      <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            data={column}
            onTaskClick={openTaskModal}
            onEditClick={openEditModal}
          />
        ))}
      </div>
      </DragDropContext>
      <TaskModal isOpen={!!selectedTask} onClose={closeTaskModal} task={selectedTask} />
      <EditTaskModal isOpen={!!editingTask} onClose={closeEditModal} task={editingTask} onSave={handleEditTask} />
      <AddNewTaskModal isOpen={isAddNewModalOpen} onClose={() => setIsAddNewModalOpen(false)} onAdd={addNewTask} />
    </div>
  );
}