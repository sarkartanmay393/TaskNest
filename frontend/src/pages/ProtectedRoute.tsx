import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { getTasksApi, logoutApi } from "~/lib/apis";
import { useStoreActions, useStoreState } from "~/state/typedHooks";

export default function ProtectedRoute({ children }: any) {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken || accessToken === "" || accessToken === null || accessToken === "undefined") {
    sessionStorage.clear();
    window.location.href = "/login";
  } else {
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    // TODO: making the app offline first
    const { setIsLoading, setTasks, setSyncInfo } = useStoreActions(action => action);
    const { tasks } = useStoreState(state => state);
    useEffect(() => {
      // Handles loading tasks from the API
      if (tasks.length === 0) {
        (async () => {
          try {
            setIsLoading(true);
            const { tasks, syncInfo } = await getTasksApi({}) as any;
            setSyncInfo({ lastSuccessfulSyncAt: syncInfo.lastSuccessfulSyncAt, status: 'success', requireSyncing: false });
            localStorage.setItem('syncInfo', JSON.stringify(syncInfo));
            setTasks(tasks.map((task: any) => ({ ...task, hasChanged: false })));
          } catch (err) {
            toast({
              title: "Database isn't available",
              description: "Failed to load tasks",
              duration: 5000,
            })
            console.log(err);
          } finally {
            setIsLoading(false);
          }
        })();
      }
    }, []);

    return (
      <div className="container mx-auto">
        <header className="shadow-sm flex justify-between items-center mb-6 bg-gray-200 p-4 rounded-md">
          <div className="text-2xl font-bold text-blue-600">
            <a href="/">TSMK</a>
          </div>
          <div className="flex gap-2">
            {window.location.pathname.includes('/board') &&
              <Button onClick={() => setIsAddNewModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                <PlusIcon className="mr-2 h-4 w-4" /> Add New
              </Button>}
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={async () => {
              const success = await logoutApi();
              if (success) {
                toast({
                  title: "Logout successful",
                  description: "You are now logged out",
                  duration: 5000,
                })
                sessionStorage.clear();
                window.location.href = "/login";
              } else {
                toast({
                  title: "Logout failed",
                  description: "Please try again",
                  duration: 5000,
                })
              }
            }}>
              Logout
            </Button>
          </div>
        </header>
        {window.location.pathname.includes('/board') ? React.cloneElement(children, { isAddNewModalOpen, setIsAddNewModalOpen }) : children}
      </div>
    );
  }

  return <></>;
}