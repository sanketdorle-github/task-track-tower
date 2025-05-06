
import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  onCreateBoardClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onCreateBoardClick }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login page
    navigate("/login");
  };
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 
            className="text-xl font-bold text-purple-700 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Kanban
          </h1>
          
          <div className="hidden md:flex items-center ml-8 space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 hover:text-purple-700"
            >
              Boards
            </Button>
            <Button 
              variant="ghost"
              className="text-gray-700 hover:text-purple-700"
            >
              Workspaces
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative hidden md:block mx-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button 
            size="sm"
            variant="ghost"
            className="rounded-full p-2"
          >
            <Bell className="h-5 w-5 text-gray-700" />
          </Button>

          <Button 
            size="sm"
            variant="outline"
            onClick={onCreateBoardClick}
            className="hidden md:flex items-center text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Plus className="h-4 w-4 mr-1" /> Create Board
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="rounded-full p-0 h-9 w-9 bg-purple-100"
              >
                <User className="h-5 w-5 text-purple-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-default">
                {user.email || "user@example.com"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
