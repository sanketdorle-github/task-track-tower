
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/AppHeader";
import BoardCard from "@/components/dashboard/BoardCard";
import CreateBoardDialog from "@/components/dashboard/CreateBoardDialog";
import { fetchBoards, createBoard, updateBoard, deleteBoard, reorderBoards } from "@/utils/boardsData";
import { Board } from "@/types/board";
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBoardId, setEditBoardId] = useState<string | null>(null);
  const [deleteBoardId, setDeleteBoardId] = useState<string | null>(null);
  const [boardToEdit, setBoardToEdit] = useState<{ id: string, title: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Fetch boards using our utility function
    const loadBoards = async () => {
      setLoading(true);
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch boards. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBoards();
  }, [navigate, toast]);
  
  const handleCreateBoard = async (title: string) => {
    try {
      const newBoard = await createBoard(title);
      setBoards(prev => [...prev, newBoard]);
      toast({
        title: "Success",
        description: "Board created successfully!",
      });
      return newBoard;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create board. Please try again.",
      });
    }
  };
  
  const handleEditBoard = (id: string) => {
    const board = boards.find(b => b.id === id);
    if (board) {
      setBoardToEdit({ id, title: board.title });
      setEditBoardId(id);
    }
  };
  
  const handleDeleteBoard = (id: string) => {
    setDeleteBoardId(id);
  };
  
  const confirmDeleteBoard = async () => {
    if (!deleteBoardId) return;
    
    try {
      await deleteBoard(deleteBoardId);
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
      const updatedBoard = await updateBoard(editBoardId, title);
      setBoards(prev => 
        prev.map(board => 
          board.id === editBoardId 
            ? { ...board, title: updatedBoard.title } 
            : board
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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area or at the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    try {
      // Optimistically update the UI
      const reorderedBoards = [...boards];
      const [movedBoard] = reorderedBoards.splice(source.index, 1);
      reorderedBoards.splice(destination.index, 0, movedBoard);
      setBoards(reorderedBoards);
      
      console.log(`Reordering board ${draggableId} from ${source.index} to ${destination.index}`);
      
      // Send reorder request to the backend
      await reorderBoards(draggableId, source.index, destination.index).catch(error => {
        console.error("Reorder error:", error);
        // If the backend update fails, revert to original state
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update board position. Reverting changes."
        });
        
        // Reload boards to get the original order
        fetchBoards().then(originalBoards => {
          setBoards(originalBoards);
        });
      });
    } catch (error) {
      console.error("Drag and drop error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update board position. Please try again."
      });
      
      // Reload boards to get the original order
      fetchBoards().then(originalBoards => {
        setBoards(originalBoards);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader onCreateBoardClick={() => setCreateDialogOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Boards</h1>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            <span>Create New Board</span>
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">No boards yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first board to get started</p>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Create a Board
            </button>
          </div>
        ) : (
          <DragDropContext 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
          >
            <Droppable droppableId="boards" direction="horizontal" type="BOARD">
              {(provided, snapshot) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
                    snapshot.isDraggingOver ? "bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2" : ""
                  }`}
                >
                  {boards.map((board, index) => (
                    <Draggable 
                      key={board.id} 
                      draggableId={board.id} 
                      index={index}
                      disableInteractiveElementBlocking={true}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            transformOrigin: "center", 
                          }}
                          className={`transition-all duration-200 ${
                            snapshot.isDragging 
                              ? "z-10 scale-105 shadow-xl" 
                              : ""
                          }`}
                        >
                          <BoardCard
                            id={board.id}
                            title={board.title}
                            color={board.color}
                            onEdit={!isDragging ? handleEditBoard : undefined}
                            onDelete={!isDragging ? handleDeleteBoard : undefined}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
        defaultValue={boardToEdit?.title || ""}
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
