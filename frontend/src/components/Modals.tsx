import { type ITask, TASK_STATUS } from "~/interfaces"
import { Button } from "./ui/button"
import { Dialog, DialogContent,DialogHeader ,DialogTitle,DialogFooter} from "./ui/dialog"
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useStoreActions, useStoreState } from "~/state/typedHooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function TaskModal({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: ITask | null }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ITask Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-semibold">Title: {task.title}</h3>
          </div>
          <div>
            <p className="text-sm">Description: {task.description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created at: {task.createdAt}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EditTaskModal({ isOpen, onClose, task, onSave }: { isOpen: boolean, onClose: () => void, task: ITask | null, onSave: (task: ITask) => void }) {
  const [editedTask, setEditedTask] = useState<ITask | null>(task)

  if (!editedTask) return null

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit ITask</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AddNewTaskModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (task: Omit<ITask, 'id' | 'createdAt'>) => void }) {
  const { addTask, setTasks, setIsLoading, setColumns } = useStoreActions((action) => action);
  const { tasks, columns } = useStoreState((state) => state);
 
  const [newTask, setNewTask] = useState<Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    columnId: 1,
    userId: JSON.parse(sessionStorage.getItem("user") ?? '').id,
    column: columns.find((column) => column.id === 1)!,
    user: undefined
  })



  const handleAdd = () => {
    addTask(newTask as ITask)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New ITask</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-title" className="text-right">
              Title
            </Label>
            <Input
              id="new-title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-description" className="text-right">
              Description
            </Label>
            <Textarea
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
              value={newTask.status}
              onValueChange={(value: 'TODO' | 'IN PROGRESS' | 'DONE') => setNewTask({ ...newTask, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">TODO</SelectItem>
                <SelectItem value="IN PROGRESS">IN PROGRESS</SelectItem>
                <SelectItem value="DONE">DONE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add ITask</Button>
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