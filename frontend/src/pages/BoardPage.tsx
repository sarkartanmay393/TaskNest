import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Board from "../components/Board";
import { useStoreActions, useStoreState } from "../state/typedHooks";
import { ITask, TASK_STATUS } from "../interfaces";
import Loading from "../components/Loading";
import { getTasksApi, logOutApi } from "../lib/apis";


import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog"
import { PlusIcon } from 'lucide-react'

// Types
type Task = {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN PROGRESS' | 'DONE'
  createdAt: string
}

// Mock data
const initialTasks: Task[] = [
  { id: '1', title: 'Task 1', description: 'Description 1', status: 'TODO', createdAt: '2023/05/01 09:00:00' },
  { id: '2', title: 'Task 2', description: 'Description 2', status: 'TODO', createdAt: '2023/05/02 10:30:00' },
  { id: '3', title: 'Task 3', description: 'Description 3', status: 'TODO', createdAt: '2023/05/03 11:45:00' },
  { id: '4', title: 'Task 4', description: 'Description 4', status: 'IN PROGRESS', createdAt: '2023/05/04 14:15:00' },
  { id: '5', title: 'Task 5', description: 'Description 5', status: 'IN PROGRESS', createdAt: '2023/05/05 16:30:00' },
  { id: '6', title: 'Task 6', description: 'Description 6', status: 'DONE', createdAt: '2023/05/06 18:00:00' },
]

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

  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
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

  const addNewTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    // setTasks([...tasks, task])
    setIsAddNewModalOpen(false)
  }

  const openTaskModal = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
  }

  const openEditModal = (task: Task) => {
    setEditingTask({ ...task })
  }

  const closeEditModal = () => {
    setEditingTask(null)
  }

  const handleEditTask = (updatedTask: Task) => {
    // setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    closeEditModal()
  }

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn title="TODO" tasks={sortedTasks.filter(task => task.status === 'TODO')} onTaskClick={openTaskModal} onEditClick={openEditModal} />
        <TaskColumn title="IN PROGRESS" tasks={sortedTasks.filter(task => task.status === 'IN PROGRESS')} onTaskClick={openTaskModal} onEditClick={openEditModal} />
        <TaskColumn title="DONE" tasks={sortedTasks.filter(task => task.status === 'DONE')} onTaskClick={openTaskModal} onEditClick={openEditModal} />
      </div>
      <TaskModal isOpen={!!selectedTask} onClose={closeTaskModal} task={selectedTask} />
      <EditTaskModal isOpen={!!editingTask} onClose={closeEditModal} task={editingTask} onSave={handleEditTask} />
      <AddNewTaskModal isOpen={isAddNewModalOpen} onClose={() => setIsAddNewModalOpen(false)} onAdd={addNewTask} />
    </div>
  );
}