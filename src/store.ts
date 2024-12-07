import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdAt: Date;
  uid: string;
  attachments?: string[];
}

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    ),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
}));