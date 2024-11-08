import { type ITask } from "~/interfaces"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useStoreActions, useStoreState } from "~/state/typedHooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { columns } from "~/lib/constants";

export function TaskModal({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: ITask | null }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg max-w-[320px] sm:max-w-[425px] lg:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Title</h2>
            <h3 className="font-semibold text-gray-700">{task.title}</h3>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-500">Description</h5>
            <p className="text-sm text-gray-700">{task.description ? task.description : <span className="font-normal italic text-gray-300">No description</span>}</p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-between items-end">
            <p className="text-xs text-gray-500">Updated at: {new Date(task.updatedAt).toLocaleString('en-US', { timeStyle: 'short', dateStyle: 'short' })}</p>
            <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600">Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EditTaskModal({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: ITask | null, onSave?: (task: ITask) => void }) {
  if (!task) return null

  const { setTasks, setRequireSyncing } = useStoreActions((action) => action);
  const { tasks } = useStoreState((state) => state);
  const [editedTask, setEditedTask] = useState<ITask | null>(task);
  const [error, setError] = useState({
    title: '',
    description: ''
  });

  const validateNewTask = () => {
    if (editedTask?.title.trim() === '') {
      setError((p) => ({ ...p, title: 'Title is required' }));
      document.getElementById('new-title')!.focus();
      return false;
    }
    return true;
  }

  const handleSave = () => {
    if (validateNewTask()) {
      if (editedTask) {
        setTasks(tasks.map(task => task.id === editedTask.id ? { ...task, ...editedTask, updatedAt: new Date().toISOString(), hasChanged: true } : task))
        setRequireSyncing(true);
      }
      onClose && onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg max-w-[320px] sm:max-w-[425px] lg:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              required
              id="title"
              value={editedTask?.title}
              onChange={(e) => setEditedTask((p) => ({ ...p!, title: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end items-start">
            {error.title.length > 0 && <p className="text-red-500 text-sm">{error.title}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedTask?.description}
              onChange={(e) => setEditedTask((p) => ({ ...p!, description: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-status" className="text-right">
              Status
            </Label>
            <Select
              required
              value={editedTask?.columnId?.toString()}
              onValueChange={(value) => setEditedTask((p) => ({
                ...p!,
                columnId: Number(value)
              }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TODO</SelectItem>
                <SelectItem value="2">IN PROGRESS</SelectItem>
                <SelectItem value="3">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AddNewTaskModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, onAdd?: (task: Omit<ITask, 'id' | 'createdAt'>) => void }) {
  const { setTasks, setRequireSyncing } = useStoreActions((action) => action);
  const { tasks } = useStoreState((state) => state);
  const [error, setError] = useState({
    title: '',
    description: ''
  });

  const [newTask, setNewTask] = useState<Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    columnId: 1,
    userId: JSON.parse(sessionStorage.getItem("user") ?? '').id,
    column: columns.find((column) => column.id === 1)!,
    user: undefined,
    hasChanged: true,
    new: true,
  })

  const validateNewTask = () => {
    if (newTask.title.trim() === '') {
      setError((p) => ({ ...p, title: 'Title is required' }));
      document.getElementById('new-title')!.focus();
      return false;
    }
    return true;
  }

  const handleAdd = () => {
    if (validateNewTask()) {
      setRequireSyncing(true);
      setTasks([...tasks, {
        ...newTask,
        id: tasks.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
      onClose();
    }
  }

  window.onkeyup = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleAdd();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg max-w-[320px] sm:max-w-[425px] lg:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New ITask</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-title" className="text-right">
              Title
            </Label>
            <Input
              name="new-title"
              id="new-title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="flex justify-end items-start">
            {error.title.length > 0 && <p className="text-red-500 text-sm">{error.title}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-description" className="text-right">
              Description
            </Label>
            <Textarea
              name="new-description"
              id="new-description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-status" className="text-right">
              Status
            </Label>
            <Select
              name="new-status"
              required
              value={newTask.columnId.toString()}
              onValueChange={(value) => setNewTask({ ...newTask, columnId: Number(value) })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"1"}>TODO</SelectItem>
                <SelectItem value={"2"}>IN PROGRESS</SelectItem>
                <SelectItem value={"3"}>COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button id="add-new-task" onClick={handleAdd}>Add ITask</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Label({ htmlFor, children, className }: { htmlFor: string, children: React.ReactNode, className?: string }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  )
}