
import React, { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  index: number;
  onAddTask: (columnId: string) => void;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditTask: (taskId: string, columnId: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  tasks,
  index,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-72 flex-shrink-0 mr-3"
        >
          <div className="bg-gray-100 rounded-md shadow">
            <div
              {...provided.dragHandleProps}
              className="p-2 font-medium flex items-center justify-between bg-gray-200 rounded-t-md"
            >
              <h3 className="text-sm truncate px-2">{title}</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{tasks.length}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditColumn(id)}>
                      Edit Column
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteColumn(id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete Column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Droppable droppableId={id} type="task">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[12rem] p-2 ${
                    snapshot.isDraggingOver ? "bg-purple-50" : ""
                  }`}
                >
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onEdit={() => onEditTask(task.id, id)}
                      onDelete={() => onDeleteTask(task.id, id)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="p-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-500 hover:text-gray-700"
                onClick={() => onAddTask(id)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardColumn;
