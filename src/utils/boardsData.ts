
import { Board } from '../types/board';

// Mock data for boards
let boards: Board[] = [
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

// Simulating API calls with a delay
const mockApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Functions for board operations
export const fetchBoards = async (): Promise<Board[]> => {
  return mockApiCall(boards);
};

export const createBoard = async (title: string): Promise<Board> => {
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
  
  boards = [...boards, newBoard];
  return mockApiCall(newBoard);
};

export const updateBoard = async (id: string, title: string): Promise<Board> => {
  const board = boards.find(b => b.id === id);
  if (!board) {
    throw new Error(`Board with id ${id} not found`);
  }
  
  board.title = title;
  return mockApiCall(board);
};

export const deleteBoard = async (id: string): Promise<string> => {
  boards = boards.filter(board => board.id !== id);
  return mockApiCall(id, 500);
};

export const reorderBoards = async (
  boardId: string, 
  sourceIndex: number, 
  destinationIndex: number
): Promise<Board[]> => {
  const reorderedBoards = [...boards];
  const [movedBoard] = reorderedBoards.splice(sourceIndex, 1);
  reorderedBoards.splice(destinationIndex, 0, movedBoard);
  
  boards = reorderedBoards;
  return mockApiCall(boards);
};
