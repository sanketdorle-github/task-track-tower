
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
  },
  {
    id: "5",
    title: "Product Roadmap",
    color: "bg-teal-500"
  },
  {
    id: "6",
    title: "Client Projects",
    color: "bg-green-500"
  },
  {
    id: "7",
    title: "Content Calendar",
    color: "bg-amber-500"
  },
  {
    id: "8",
    title: "Team OKRs",
    color: "bg-red-500"
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
    "bg-green-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500"
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
  console.log(`Reordering board ${boardId} from ${sourceIndex} to ${destinationIndex}`);
  
  // Create a copy of the boards array for reordering
  const reorderedBoards = [...boards];
  const [movedBoard] = reorderedBoards.splice(sourceIndex, 1);
  reorderedBoards.splice(destinationIndex, 0, movedBoard);
  
  // Update the global boards array
  boards = reorderedBoards;
  
  // Return the updated boards after a delay
  return mockApiCall([...boards]);
};
