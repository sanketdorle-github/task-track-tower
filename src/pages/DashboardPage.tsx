
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/AppHeader";
import BoardCard from "@/components/dashboard/BoardCard";
import CreateBoardDialog from "@/components/dashboard/CreateBoardDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Board {
  id: string;
  title: string;
  color?: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBoardId, setEditBoardId] = useState<string | null>(null);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);
  
  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Fetch boards (mock data for now)
    fetchBoards();
  }, [navigate]);
  
  const fetchBoards = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    
    setBoards(mockBoards);
    setLoading(false);
  };
  
  const handleCreateBoard = async (title: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a random ID and add new board
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      color: getRandomColor(),
    };
    
    setBoards(prev => [...prev, newBoard]);
    
    return newBoard;
  };
  
  const handleEditBoard = (id: string) => {
    const board = boards.find(b => b.id === id);
    if (board) {
      setBoardToEdit(board);
      setEditBoardId(id);
    }
  };
  
  const handleDeleteBoard = (id: string) => {
    setDeleteBoardId(id);
  };
  
  const confirmDeleteBoard = async () => {
    if (!deleteBoardId) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove board from state
      setBoards(prev => prev.filter(board => board.id !== deleteBoardId));
      
      toast({
        title: "Success",
        description: "Board deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete board. Please try again.",
      });
    } finally {
      setDeleteBoardId(null);
    }
  };
  
  const handleUpdateBoard = async (title: string) => {
    if (!editBoardId) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update board in state
      setBoards(prev =>
        prev.map(board =>
          board.id === editBoardId ? { ...board, title } : board
        )
      );
      
      toast({
        title: "Success",
        description: "Board updated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update board. Please try again.",
      });
    } finally {
      setEditBoardId(null);
      setBoardToEdit(null);
    }
  };
  
  // Helper function to get random color for new boards
  const getRandomColor = () => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-green-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onCreateBoardClick={() => setCreateDialogOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Boards</h1>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            <span>Create New Board</span>
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 mb-4">No boards yet</h2>
            <p className="text-gray-500 mb-6">Create your first board to get started</p>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Create a Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.title}
                color={board.color}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateBoard={handleCreateBoard}
      />
      
      {/* Edit Board Dialog */}
      <CreateBoardDialog
        open={!!editBoardId}
        onOpenChange={(open) => {
          if (!open) {
            setEditBoardId(null);
            setBoardToEdit(null);
          }
        }}
        onCreateBoard={handleUpdateBoard}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBoardId} onOpenChange={(open) => !open && setDeleteBoardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the board and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBoard} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;
