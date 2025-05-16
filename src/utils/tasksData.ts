
import { Column, Task } from '../types/board';

// Mock data for columns and tasks
let columnsMap: Record<string, Column[]> = {};

// Simulating API calls with a delay
const mockApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Initialize with dummy data for a specific board
const initializeBoard = (boardId: string) => {
  if (!columnsMap[boardId]) {
    columnsMap[boardId] = [
      {
        id: "column1",
        title: "To Do",
        boardId,
        tasks: [
          { id: "task1", columnId: "column1", title: "Research competitors", description: "Look at similar products and identify strengths and weaknesses" },
          { id: "task2", columnId: "column1", title: "Create wireframes", description: "Design preliminary wireframes for key screens" },
          { id: "task3", columnId: "column1", title: "Setup development environment" }
        ]
      },
      {
        id: "column2",
        title: "In Progress",
        boardId,
        tasks: [
          { id: "task4", columnId: "column2", title: "Implement authentication", description: "Create login and registration flows" },
          { id: "task5", columnId: "column2", title: "Build dashboard UI" }
        ]
      },
      {
        id: "column3",
        title: "Review",
        boardId,
        tasks: [
          { id: "task6", columnId: "column3", title: "Code review: API endpoints", description: "Review and optimize API endpoints" }
        ]
      },
      {
        id: "column4",
        title: "Done",
        boardId,
        tasks: [
          { id: "task7", columnId: "column4", title: "Setup project repo", description: "Initialize repository and configure CI/CD" },
          { id: "task8", columnId: "column4", title: "Create project plan" }
        ]
      }
    ];
  }
  return columnsMap[boardId];
};

// Functions for column and task operations
export const fetchBoardColumns = async (boardId: string): Promise<Column[]> => {
  // Initialize if needed
  const columns = initializeBoard(boardId);
  return mockApiCall(columns, 1000);
};

export const createColumn = async (title: string, boardId: string): Promise<Column> => {
  const newColumn: Column = {
    id: `column-${Date.now()}`,
    title,
    boardId,
    tasks: [],
  };
  
  if (!columnsMap[boardId]) {
    initializeBoard(boardId);
  }
  
  columnsMap[boardId] = [...columnsMap[boardId], newColumn];
  return mockApiCall(newColumn);
};

export const updateColumn = async (id: string, title: string): Promise<{ id: string, title: string }> => {
  // Find the column in all boards
  for (const boardId in columnsMap) {
    const columnIndex = columnsMap[boardId].findIndex(c => c.id === id);
    if (columnIndex !== -1) {
      columnsMap[boardId][columnIndex].title = title;
      return mockApiCall({ id, title });
    }
  }
  throw new Error(`Column with id ${id} not found`);
};

export const deleteColumn = async (id: string): Promise<string> => {
  // Find the column in all boards
  for (const boardId in columnsMap) {
    const columnIndex = columnsMap[boardId].findIndex(c => c.id === id);
    if (columnIndex !== -1) {
      columnsMap[boardId] = columnsMap[boardId].filter(c => c.id !== id);
      return mockApiCall(id, 500);
    }
  }
  throw new Error(`Column with id ${id} not found`);
};

export const createTask = async (columnId: string, title: string, description: string): Promise<Task> => {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    columnId,
    title,
    description,
  };
  
  // Find the column in all boards
  for (const boardId in columnsMap) {
    const column = columnsMap[boardId].find(c => c.id === columnId);
    if (column) {
      column.tasks.push(newTask);
      return mockApiCall(newTask);
    }
  }
  throw new Error(`Column with id ${columnId} not found`);
};

export const updateTask = async (id: string, columnId: string, title: string, description: string): Promise<{ id: string, columnId: string, title: string, description: string }> => {
  // Find the task in all boards and columns
  for (const boardId in columnsMap) {
    for (const column of columnsMap[boardId]) {
      if (column.id === columnId) {
        const taskIndex = column.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
          column.tasks[taskIndex].title = title;
          column.tasks[taskIndex].description = description;
          return mockApiCall({ id, columnId, title, description });
        }
      }
    }
  }
  throw new Error(`Task with id ${id} not found in column ${columnId}`);
};

export const deleteTask = async (id: string, columnId: string): Promise<{ id: string, columnId: string }> => {
  // Find the task in all boards and columns
  for (const boardId in columnsMap) {
    for (const column of columnsMap[boardId]) {
      if (column.id === columnId) {
        column.tasks = column.tasks.filter(t => t.id !== id);
        return mockApiCall({ id, columnId }, 500);
      }
    }
  }
  throw new Error(`Task with id ${id} not found in column ${columnId}`);
};

export const moveTask = async (taskId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number): Promise<{ taskId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number }> => {
  // Find the source and destination columns
  let sourceColumn: Column | undefined;
  let destColumn: Column | undefined;
  
  for (const boardId in columnsMap) {
    if (!sourceColumn) {
      sourceColumn = columnsMap[boardId].find(c => c.id === sourceColumnId);
    }
    if (!destColumn) {
      destColumn = columnsMap[boardId].find(c => c.id === destColumnId);
    }
    if (sourceColumn && destColumn) break;
  }
  
  if (!sourceColumn || !destColumn) {
    throw new Error("Source or destination column not found");
  }
  
  // Move the task
  const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
  movedTask.columnId = destColumnId;
  destColumn.tasks.splice(destIndex, 0, movedTask);
  
  return mockApiCall({
    taskId,
    sourceColumnId,
    destColumnId,
    sourceIndex,
    destIndex
  });
};

export const moveColumn = async (columnId: string, sourceIndex: number, destIndex: number): Promise<{ columnId: string, sourceIndex: number, destIndex: number }> => {
  // Find the board that contains the column
  for (const boardId in columnsMap) {
    const columnIndex = columnsMap[boardId].findIndex(c => c.id === columnId);
    if (columnIndex !== -1) {
      // Create a copy of the columns array for smoother visual transitions
      const columns = [...columnsMap[boardId]];
      
      // Extract the column to be moved but don't modify the array yet
      const movedColumn = columns[sourceIndex];
      
      // Update the columnsMap with the reordered columns - do this in a single operation
      // to reduce visual jitter
      const newColumns = [...columns];
      newColumns.splice(sourceIndex, 1);
      newColumns.splice(destIndex, 0, movedColumn);
      columnsMap[boardId] = newColumns;
      
      // Return a promise with a slightly reduced delay to make animations smoother
      return mockApiCall(
        {
          columnId,
          sourceIndex,
          destIndex
        },
        300 // Reduced delay for smoother transitions
      );
    }
  }
  
  throw new Error(`Column with id ${columnId} not found`);
};
