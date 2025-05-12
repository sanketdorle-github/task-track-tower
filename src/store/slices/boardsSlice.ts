
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../types/board';

interface BoardsState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

// Simulating API calls with a delay
const mockApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Async thunk actions
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async () => {
    // Mock data
    const mockBoards: Board[] = [
      {
        id: "1",
        title: "Project Alpha",
        color: "bg-purple-500"
      },
      {
        id: "2",
        title: "Marketing Campaign",
        color: "bg-blue-500"
      },
      {
        id: "3",
        title: "Website Redesign",
        color: "bg-indigo-500"
      },
      {
        id: "4",
        title: "Personal Tasks",
        color: "bg-pink-500"
      }
    ];
    
    return mockApiCall(mockBoards);
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (title: string) => {
    // Generate a random color
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-green-500"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      color: randomColor,
    };
    
    return mockApiCall(newBoard);
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ id, title }: { id: string, title: string }) => {
    return mockApiCall({ id, title });
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (id: string) => {
    await mockApiCall(null, 500);
    return id;
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch boards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      
      // Create board
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      
      // Update board
      .addCase(updateBoard.fulfilled, (state, action) => {
        const { id, title } = action.payload;
        const board = state.boards.find(b => b.id === id);
        if (board) {
          board.title = title;
        }
      })
      
      // Delete board
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter(board => board.id !== action.payload);
      });
  },
});

export default boardsSlice.reducer;
