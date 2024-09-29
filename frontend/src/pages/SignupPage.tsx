import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signUpApi } from "~/lib/apis";
import { toast } from "~/hooks/use-toast";

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const { user, token } = await signUpApi({ name: data.firstName, email: data.email, password: data.password });
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Signup successful",
        description: "You are now signed up",
        duration: 3000,
      })
      navigate('/')
    } catch (error: unknown) {
      toast({
        title: "Signup failed",
        description: "Please try again",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-500 mb-6">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
              aria-invalid={errors.lastName ? "true" : "false"}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                }
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                }
              })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "Your passwords do not match";
                  }
                }
              })}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'Signup'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
            Signup with Google
          </Button>
        </div>
      </div>
    </div>
  );
}