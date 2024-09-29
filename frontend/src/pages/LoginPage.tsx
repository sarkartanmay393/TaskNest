import { auth } from "../firebase.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/hooks/use-toast";
import { loginApi, storeGoogleIdApi } from "~/lib/apis";

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const { user, token } = await loginApi(data);
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: "You are now logged in",
        duration: 3000,
      })
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Login failed",
        description: error.message,
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("User signed in:", user);
      const token = await user.getIdToken();
      const data = await storeGoogleIdApi({ googleId: user.uid });
      if (data) {
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("user", JSON.stringify({
          id: user.uid,
          email: user.email,
          name: user.displayName,
        }));
        sessionStorage.setItem("userConfig", JSON.stringify(data.userConfig));
        toast({
          title: "Login successful",
          description: "You are now Logged in",
          duration: 3000,
        })
        navigate('/');
      } else {
        console.log("Failed to store googleId");
        sessionStorage.clear();
        localStorage.clear();
        throw new Error("Failed to store googleId");
      }
      toast({
        title: "Login successful",
        description: "You are now logged in",
        duration: 3000,
      })
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Login failed",
        description: error.message,
        duration: 3000,
      })
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-500 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={handleGoogleLogin} variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
            <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="google logo" className="w-4 h-4 mr-2" />
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
