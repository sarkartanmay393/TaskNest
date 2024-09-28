export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center">Welcome to Voosho Task Manager</h1>
      <p className="text-center">
        Voosho Task Manager is a simple task management application that allows you to create, update, and delete tasks.
      </p>
      <button onClick={() => window.location.href = "/board"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Get Started
      </button>
    </div>
  );
}