
export interface Board {
  id: string;
  title: string;
  color?: string;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
}
