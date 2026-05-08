import * as ImagePicker from "expo-image-picker";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateCatImage = (
  image: ImagePicker.ImagePickerAsset,
): string[] => {
  const errors: string[] = [];

  if (image.fileSize && image.fileSize > MAX_FILE_SIZE) {
    errors.push(
      `File size must be under 5MB. Your file is ${formatFileSize(image.fileSize)}.`,
    );
  }

  if (image.mimeType && !ALLOWED_TYPES.includes(image.mimeType)) {
    errors.push("File type not supported. Please use JPEG, PNG, GIF or WEBP.");
  }

  return errors;
};
