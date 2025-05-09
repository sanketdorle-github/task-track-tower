import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/AppHeader";
import BoardColumn from "@/components/board/BoardColumn";
import TaskDialog from "@/components/board/TaskDialog";
import ColumnDialog from "@/components/board/ColumnDialog";
import { Button } from "@/components/ui/button";
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

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  columns: Column[];
}

const BoardPage = () => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { toast } = useToast();
  
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Task Dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Column Dialog state
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>(undefined);
  const [isColumnEditMode, setIsColumnEditMode] = useState(false);
  
  // Delete Dialog state
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [deleteTaskInfo, setDeleteTaskInfo] = useState<{ taskId: string; columnId: string } | null>(null);

  // Check auth and fetch board data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [navigate, boardId]);

  const fetchBoard = async (id: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockBoard: Board = {
      id,
      title: "Project Alpha",
      columns: [
        {
          id: "column1",
          title: "To Do",
          tasks: [
            { id: "task1", title: "Research competitors", description: "Look at similar products and identify strengths and weaknesses" },
            { id: "task2", title: "Create wireframes", description: "Design preliminary wireframes for key screens" },
            { id: "task3", title: "Setup development environment" }
          ]
        },
        {
          id: "column2",
          title: "In Progress",
          tasks: [
            { id: "task4", title: "Implement authentication", description: "Create login and registration flows" },
            { id: "task5", title: "Build dashboard UI" }
          ]
        },
        {
          id: "column3",
          title: "Review",
          tasks: [
            { id: "task6", title: "Code review: API endpoints", description: "Review and optimize API endpoints" }
          ]
        },
        {
          id: "column4",
          title: "Done",
          tasks: [
            { id: "task7", title: "Setup project repo", description: "Initialize repository and configure CI/CD" },
            { id: "task8", title: "Create project plan" }
          ]
        }
      ]
    };
    
    setBoard(mockBoard);
    setLoading(false);
  };
  
  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    
    // Dropped outside the list or at the same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    if (!board) return;
    
    // Clone current board to make updates
    const updatedBoard = { ...board };
    
    if (type === "column") {
      // Handle column reordering
      const reorderedColumns = Array.from(updatedBoard.columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      
      updatedBoard.columns = reorderedColumns;
      setBoard(updatedBoard);
      // Here you would update this in your backend
      return;
    }
    
    // Handle task reordering
    const sourceColumn = updatedBoard.columns.find(c => c.id === source.droppableId);
    const destColumn = updatedBoard.columns.find(c => c.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      
      sourceColumn.tasks = reorderedTasks;
    } else {
      // Moving to another column
      const sourceColumnTasks = Array.from(sourceColumn.tasks);
      const destColumnTasks = Array.from(destColumn.tasks);
      
      const [movedTask] = sourceColumnTasks.splice(source.index, 1);
      destColumnTasks.splice(destination.index, 0, movedTask);
      
      sourceColumn.tasks = sourceColumnTasks;
      destColumn.tasks = destColumnTasks;
    }
    
    setBoard(updatedBoard);
    // Here you would update this in your backend
  };
  
  // Task CRUD operations
  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setSelectedTask(undefined);
    setIsEditMode(false);
    setTaskDialogOpen(true);
  };
  
  const handleEditTask = (taskId: string, columnId: string) => {
    if (!board) return;
    
    const column = board.columns.find(c => c.id === columnId);
    if (!column) return;
    
    const task = column.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setSelectedColumnId(columnId);
    setSelectedTask(task);
    setIsEditMode(true);
    setTaskDialogOpen(true);
  };
  
  const handleDeleteTask = (taskId: string, columnId: string) => {
    setDeleteTaskInfo({ taskId, columnId });
  };
  
  const confirmDeleteTask = async () => {
    if (!deleteTaskInfo || !board) return;
    
    try {
      const { taskId, columnId } = deleteTaskInfo;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedBoard = { ...board };
      const columnIndex = updatedBoard.columns.findIndex(c => c.id === columnId);
      
      if (columnIndex === -1) return;
      
      updatedBoard.columns[columnIndex].tasks = updatedBoard.columns[columnIndex].tasks.filter(
        t => t.id !== taskId
      );
      
      setBoard(updatedBoard);
      
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    } finally {
      setDeleteTaskInfo(null);
    }
  };
  
  // Save task (create or update)
  const handleSaveTask = async (values: { title: string; description: string }, taskId?: string, columnId?: string) => {
    if (!board) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBoard = { ...board };
      
      if (isEditMode && taskId && columnId) {
        // Update existing task
        const columnIndex = updatedBoard.columns.findIndex(c => c.id === columnId);
        if (columnIndex === -1) return;
        
        const taskIndex = updatedBoard.columns[columnIndex].tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        updatedBoard.columns[columnIndex].tasks[taskIndex] = {
          ...updatedBoard.columns[columnIndex].tasks[taskIndex],
          title: values.title,
          description: values.description,
        };
        
        toast({
          title: "Success",
          description: "Task updated successfully!",
        });
      } else if (columnId) {
        // Create new task
        const columnIndex = updatedBoard.columns.findIndex(c => c.id === columnId);
        if (columnIndex === -1) return;
        
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: values.title,
          description: values.description,
        };
        
        updatedBoard.columns[columnIndex].tasks.push(newTask);
        
        toast({
          title: "Success",
          description: "Task created successfully!",
        });
      }
      
      setBoard(updatedBoard);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save task. Please try again.",
      });
    }
  };
  
  // Column CRUD operations
  const handleAddColumn = () => {
    setSelectedColumn(undefined);
    setIsColumnEditMode(false);
    setColumnDialogOpen(true);
  };
  
  const handleEditColumn = (columnId: string) => {
    if (!board) return;
    
    const column = board.columns.find(c => c.id === columnId);
    if (!column) return;
    
    setSelectedColumn(column);
    setIsColumnEditMode(true);
    setColumnDialogOpen(true);
  };
  
  const handleDeleteColumn = (columnId: string) => {
    setDeleteColumnId(columnId);
  };
  
  const confirmDeleteColumn = async () => {
    if (!deleteColumnId || !board) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedBoard = { ...board };
      updatedBoard.columns = updatedBoard.columns.filter(c => c.id !== deleteColumnId);
      
      setBoard(updatedBoard);
      
      toast({
        title: "Success",
        description: "Column deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete column. Please try again.",
      });
    } finally {
      setDeleteColumnId(null);
    }
  };
  
  // Save column (create or update)
  const handleSaveColumn = async (values: { title: string }, columnId?: string) => {
    if (!board) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBoard = { ...board };
      
      if (isColumnEditMode && columnId) {
        // Update existing column
        const columnIndex = updatedBoard.columns.findIndex(c => c.id === columnId);
        if (columnIndex === -1) return;
        
        updatedBoard.columns[columnIndex].title = values.title;
        
        toast({
          title: "Success",
          description: "Column updated successfully!",
        });
      } else {
        // Create new column
        const newColumn: Column = {
          id: `column-${Date.now()}`,
          title: values.title,
          tasks: [],
        };
        
        updatedBoard.columns.push(newColumn);
        
        toast({
          title: "Success",
          description: "Column created successfully!",
        });
      }
      
      setBoard(updatedBoard);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background">
        <AppHeader />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-72 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background dark:bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl text-gray-600 dark:text-gray-300">Board not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{board.title}</h1>
          <Button 
            onClick={handleAddColumn}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Column
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex overflow-x-auto pb-4"
                style={{ minHeight: "calc(100vh - 180px)" }}
              >
                {board.columns.map((column, index) => (
                  <BoardColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={column.tasks}
                    index={index}
                    onAddTask={handleAddTask}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        columnId={selectedColumnId}
        onSave={handleSaveTask}
        isEditMode={isEditMode}
      />
      
      {/* Column Dialog */}
      <ColumnDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        column={selectedColumn}
        onSave={handleSaveColumn}
        isEditMode={isColumnEditMode}
      />
      
      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={!!deleteTaskInfo} onOpenChange={(open) => !open && setDeleteTaskInfo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Column Confirmation Dialog */}
      <AlertDialog open={!!deleteColumnId} onOpenChange={(open) => !open && setDeleteColumnId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this column and all its tasks? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteColumn} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BoardPage;
