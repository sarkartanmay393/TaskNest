import { PlusIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { logoutApi } from "~/lib/apis";

export default function ProtectedRoute({ children }: any) {
  const accessToken = sessionStorage.getItem("accessToken");
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false)


  if (!accessToken || accessToken === "" || accessToken === null || accessToken === "undefined") {
    sessionStorage.clear();
    window.location.href = "/login";
  } else {
    return (
      <div>
        <header className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-blue-600">
            <a href="/">Task Manager</a>
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
}