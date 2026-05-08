import { UploadFile, uploadCatImage } from "@/api/cats";
import { catQueryKeys } from "@/api/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";

const getUploadErrorMessages = (error: any): string[] => {
  if (!error.response) {
    return ["Network error. Please check your connection and try again."];
  }

  const status = error.response.status;
  const apiMessage =
    error.response.data?.message ??
    error.response.data?.error ??
    error.response.data;

  if (status === 400) {
    return [
      typeof apiMessage === "string"
        ? apiMessage
        : "Invalid image. Please choose a valid cat image.",
    ];
  }

  if (status === 401) {
    return ["Unauthorised. Please check your API key."];
  }

  if (status === 413) {
    return ["Image is too large. Please choose a smaller image."];
  }

  return [`Upload failed (${status}). Please try again.`];
};

export const useUploadCat = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<string[]>([]);

  const uploadMutation = useMutation({
    mutationFn: uploadCatImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catQueryKeys.images });
      router.replace("/");
    },
    onError: (error) => {
      setErrors(getUploadErrorMessages(error));
      console.error("Upload error:", error);
    },
  });

  return {
    clearErrors: () => setErrors([]),
    errors,
    isUploading: uploadMutation.isPending,
    setValidationErrors: setErrors,
    upload: (file: UploadFile) => uploadMutation.mutate(file),
  };
};
