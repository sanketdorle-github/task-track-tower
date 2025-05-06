
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormItem from "@/components/ui/form-item";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormValues>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof RegisterFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormValues> = {};
    
    if (!formValues.name) {
      newErrors.name = "Name is required";
    }
    
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
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
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Registration successful! You can now log in.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormItem label="Name" error={errors.name}>
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formValues.name}
              onChange={handleChange}
              className="w-full"
            />
          </FormItem>
          
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
              placeholder="Create a password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full"
            />
          </FormItem>
          
          <FormItem label="Confirm Password" error={errors.confirmPassword}>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formValues.confirmPassword}
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
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
