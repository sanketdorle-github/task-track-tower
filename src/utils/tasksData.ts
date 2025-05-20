
import axios from 'axios';
import { Column, Task } from '../types/board';

const API_URL = 'http://localhost:5000/api';

// Simulating API calls with a delay and axios
const mockApiCall = async <T>(promise: Promise<T>, delay = 800): Promise<T> => {
  try {
    // Add artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, delay));
    const result = await promise;
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Functions for column and task operations
export const fetchBoardColumns = async (boardId: string): Promise<Column[]> => {
  return mockApiCall(
    axios.get(`${API_URL}/boards/${boardId}/columns`).then(response => {
      // Transform MongoDB _id to id for frontend compatibility
      return response.data.map((column: any) => ({
        id: column._id,
        title: column.title,
        boardId: column.boardId,
        tasks: column.tasks.map((task: any) => ({
          id: task.id || task._id,
          title: task.title,
          description: task.description,
          columnId: column._id
        }))
      }));
    }),
    1000
  );
};

export const createColumn = async (title: string, boardId: string): Promise<Column> => {
  return mockApiCall(
    axios.post(`${API_URL}/columns`, { title, boardId }).then(response => {
      return {
        id: response.data._id,
        title: response.data.title,
        boardId: response.data.boardId,
        tasks: []
      };
    })
  );
};

export const updateColumn = async (id: string, title: string): Promise<{ id: string, title: string }> => {
  return mockApiCall(
    axios.put(`${API_URL}/columns/${id}`, { title }).then(() => {
      return { id, title };
    })
  );
};

export const deleteColumn = async (id: string): Promise<string> => {
  return mockApiCall(
    axios.delete(`${API_URL}/columns/${id}`).then(() => id),
    500
  );
};

export const createTask = async (columnId: string, title: string, description: string): Promise<Task> => {
  return mockApiCall(
    axios.post(`${API_URL}/columns/${columnId}/tasks`, { title, description }).then(response => {
      return {
        id: response.data.id,
        columnId,
        title,
        description
      };
    })
  );
};

export const updateTask = async (
  id: string, 
  columnId: string, 
  title: string, 
  description: string
): Promise<{ id: string, columnId: string, title: string, description: string }> => {
  return mockApiCall(
    axios.put(`${API_URL}/columns/${columnId}/tasks/${id}`, { title, description }).then(() => {
      return { id, columnId, title, description };
    })
  );
};

export const deleteTask = async (id: string, columnId: string): Promise<{ id: string, columnId: string }> => {
  return mockApiCall(
    axios.delete(`${API_URL}/columns/${columnId}/tasks/${id}`).then(() => {
      return { id, columnId };
    }),
    500
  );
};

export const moveTask = async (
  taskId: string, 
  sourceColumnId: string, 
  destColumnId: string, 
  sourceIndex: number, 
  destIndex: number
): Promise<{ taskId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number }> => {
  return mockApiCall(
    axios.post(`${API_URL}/tasks/${taskId}/move`, {
      sourceColumnId,
      destColumnId,
      sourceIndex,
      destIndex
    }).then(() => {
      return {
        taskId,
        sourceColumnId,
        destColumnId,
        sourceIndex,
        destIndex
      };
    })
  );
};

export const moveColumn = async (
  columnId: string, 
  sourceIndex: number, 
  destIndex: number
): Promise<{ columnId: string, sourceIndex: number, destIndex: number }> => {
  return mockApiCall(
    axios.post(`${API_URL}/columns/${columnId}/move`, {
      sourceIndex,
      destIndex
    }).then(() => {
      return {
        columnId,
        sourceIndex,
        destIndex
      };
    }),
    300 // Reduced delay for smoother transitions
  );
};
