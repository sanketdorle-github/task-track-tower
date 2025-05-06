
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your Kanban boards</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
