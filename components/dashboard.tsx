"use client";

import UploadButton from "./upload-button";
import { Ghost, Loader2, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface FileType {
  id: string;
  name: string;
  createdAt: string;
}

const Dashboard = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(null);

  // Fetch user files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) throw new Error("Failed to fetch files");

        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Handle file deletion
  const handleDeleteFile = async (id: string) => {
    setCurrentlyDeletingFile(id);

    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete file");

      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setCurrentlyDeletingFile(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-4">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-black text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {/* Display all user files */}
      {files.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-pink-800" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">{file.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="w-8 h-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
