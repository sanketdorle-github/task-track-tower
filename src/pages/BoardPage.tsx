
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchBoardColumns, 
  createColumn, 
  updateColumn, 
  deleteColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask
} from "@/store/slices/tasksSlice";
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
import { Task } from "@/types/board";

const BoardPage = () => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  const { boards } = useAppSelector((state) => state.boards);
  const { columns, loading } = useAppSelector((state) => state.tasks);
  
  const board = boards.find(b => b.id === boardId);
  
  // Task Dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Column Dialog state
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<{ id: string, title: string } | undefined>(undefined);
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
      dispatch(fetchBoardColumns(boardId));
    }
  }, [navigate, boardId, dispatch]);

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    
    // Dropped outside the list or at the same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    if (type === "column") {
      // Handle column reordering in a real app
      // Currently, we don't have an API for this, so we'll skip it
      return;
    }
    
    // Handle task reordering
    dispatch(moveTask({
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destColumnId: destination.droppableId,
      sourceIndex: source.index,
      destIndex: destination.index
    }));
  };
  
  // Task CRUD operations
  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setSelectedTask(undefined);
    setIsEditMode(false);
    setTaskDialogOpen(true);
  };
  
  const handleEditTask = (taskId: string, columnId: string) => {
    const column = columns.find(c => c.id === columnId);
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
    if (!deleteTaskInfo) return;
    
    try {
      const { taskId, columnId } = deleteTaskInfo;
      
      const resultAction = await dispatch(deleteTask({ id: taskId, columnId }));
      if (deleteTask.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Task deleted successfully!",
        });
      }
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
    try {
      if (isEditMode && taskId && columnId) {
        // Update existing task
        const resultAction = await dispatch(updateTask({
          id: taskId,
          columnId,
          title: values.title,
          description: values.description
        }));
        
        if (updateTask.fulfilled.match(resultAction)) {
          toast({
            title: "Success",
            description: "Task updated successfully!",
          });
        }
      } else if (columnId) {
        // Create new task
        const resultAction = await dispatch(createTask({
          columnId,
          title: values.title,
          description: values.description
        }));
        
        if (createTask.fulfilled.match(resultAction)) {
          toast({
            title: "Success",
            description: "Task created successfully!",
          });
        }
      }
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
    const column = columns.find(c => c.id === columnId);
    if (!column) return;
    
    setSelectedColumn({ id: column.id, title: column.title });
    setIsColumnEditMode(true);
    setColumnDialogOpen(true);
  };
  
  const handleDeleteColumn = (columnId: string) => {
    setDeleteColumnId(columnId);
  };
  
  const confirmDeleteColumn = async () => {
    if (!deleteColumnId) return;
    
    try {
      const resultAction = await dispatch(deleteColumn(deleteColumnId));
      
      if (deleteColumn.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Column deleted successfully!",
        });
      }
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
    try {
      if (isColumnEditMode && columnId) {
        // Update existing column
        const resultAction = await dispatch(updateColumn({
          id: columnId,
          title: values.title
        }));
        
        if (updateColumn.fulfilled.match(resultAction)) {
          toast({
            title: "Success",
            description: "Column updated successfully!",
          });
        }
      } else if (boardId) {
        // Create new column
        const resultAction = await dispatch(createColumn({
          title: values.title,
          boardId
        }));
        
        if (createColumn.fulfilled.match(resultAction)) {
          toast({
            title: "Success",
            description: "Column created successfully!",
          });
        }
      }
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

  if (!boardId || (!loading && !board)) {
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{board?.title || "Board"}</h1>
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
                {columns.map((column, index) => (
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
