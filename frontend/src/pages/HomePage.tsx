import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="border min-h-[calc(100vh-100px)] radius-lg bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Welcome to Voosho Task Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Simplify your task management and boost productivity.
        </p>
        <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300">
          <a href="/board">Get Started</a>
        </Button>
      </div>
    </div>
  );
}