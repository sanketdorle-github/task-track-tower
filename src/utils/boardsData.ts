
import axios from 'axios';
import { Board } from '../types/board';

const API_URL = 'http://localhost:5000/api';

// Simulating API calls with a delay and axios
const mockApiCall = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    // Add artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = await promise;
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Functions for board operations
export const fetchBoards = async (): Promise<Board[]> => {
  return mockApiCall(
    axios.get(`${API_URL}/boards`).then(response => {
      // Transform MongoDB _id to id for frontend compatibility
      return response.data.map((board: any) => ({
        id: board._id,
        title: board.title,
        color: board.color
      }));
    })
  );
};

export const createBoard = async (title: string): Promise<Board> => {
  return mockApiCall(
    axios.post(`${API_URL}/boards`, { title }).then(response => {
      return {
        id: response.data.id,
        title: response.data.title,
        color: response.data.color
      };
    })
  );
};

export const updateBoard = async (id: string, title: string): Promise<Board> => {
  return mockApiCall(
    axios.put(`${API_URL}/boards/${id}`, { title }).then(response => {
      return {
        id: response.data._id,
        title: response.data.title,
        color: response.data.color
      };
    })
  );
};

export const deleteBoard = async (id: string): Promise<string> => {
  return mockApiCall(
    axios.delete(`${API_URL}/boards/${id}`).then(() => id)
  );
};
