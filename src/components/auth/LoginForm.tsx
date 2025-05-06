
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormItem from "@/components/ui/form-item";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof LoginFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};
    
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formValues.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call for now - in a real app this would call your auth API
    try {
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock token in localStorage (in real app, this would come from your API)
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify({ id: "1", email: formValues.email }));
      
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormItem label="Email" error={errors.email}>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full"
            />
          </FormItem>
          
          <FormItem label="Password" error={errors.password}>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full"
            />
          </FormItem>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
