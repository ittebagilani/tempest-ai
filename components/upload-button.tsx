"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, FileIcon, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFiles);

        if (!res) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Fetch file details from the backend
        try {
          const response = await fetch(`/api/files/${key}`);
          const file = await response.json();

          if (file?.id) {
            router.push(`/dashboard/${file.id}`);
          }
        } catch (error) {
          console.error("Error fetching file:", error);
          toast({
            title: "Upload successful, but failed to load file",
            description: "Please refresh the page.",
            variant: "destructive",
          });
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg cursor-pointer"
        >
          <input {...getInputProps()} className="hidden" />
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
            <p className="mb-2 text-sm text-zinc-700">
              <span className="font-semibold">Click to upload</span> or drag and
              drop.
            </p>
            <p className="text-xs text-zinc-500">PDF (up to 4 MB)</p>
            {acceptedFiles && acceptedFiles[0] && (
              <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="px-3 py-2 h-full grid place-items-center">
                  <FileIcon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="px-3 py-2 h-full text-sm truncate">
                  {acceptedFiles[0].name}
                </div>
              </div>
            )}
            {isUploading && (
              <div className="w-full mt-4 max-w-xs mx-auto">
                <Progress
                  value={uploadProgress}
                  className="h-1 w-full bg-zinc-200"
                  indicatorColor={uploadProgress === 100 ? "bg-green-500" : ""}
                />
                {uploadProgress === 100 && (
                  <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Redirecting...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="bg-pink-600 hover:bg-pink-600/80">Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
