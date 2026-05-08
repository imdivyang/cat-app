import PageHeader from "@/components/PageHeader";
import { useUploadCat } from "@/hooks/use-upload-cat";
import { formatFileSize, validateCatImage } from "@/utils/image-validation";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SelectedImage {
  uri: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

const toSelectedImage = (
  asset: ImagePicker.ImagePickerAsset,
): SelectedImage => ({
  uri: asset.uri,
  fileName: asset.fileName ?? "cat.jpg",
  fileSize: asset.fileSize,
  mimeType: asset.mimeType ?? "image/jpeg",
});

export default function UploadCatScreen() {
  const router = useRouter();
  const { clearErrors, errors, isUploading, setValidationErrors, upload } =
    useUploadCat();
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const handlePickImage = async () => {
    try {
      clearErrors();

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload cat images.",
          [{ text: "OK" }],
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const validationErrors = validateCatImage(asset);

      if (validationErrors.length > 0) {
        setValidationErrors(validationErrors);
        return;
      }

      setSelectedImage(toSelectedImage(asset));
    } catch (error) {
      console.error("Pick image error:", error);
      setValidationErrors(["Failed to pick image. Please try again."]);
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      setValidationErrors(["Please select an image first."]);
      return;
    }

    clearErrors();
    upload({
      uri: selectedImage.uri,
      name: selectedImage.fileName ?? "cat.jpg",
      type: selectedImage.mimeType ?? "image/jpeg",
    });
  };

  const handleClear = () => {
    setSelectedImage(null);
    clearErrors();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
      <PageHeader
        title="Upload a Cat"
        subtitle="JPEG, PNG, GIF or WEBP - max 5MB"
        showBack
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {selectedImage ? (
          <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              source={{ uri: selectedImage.uri }}
              className="h-72 w-full"
              resizeMode="cover"
            />
            <View className="flex-row items-center justify-between p-4">
              <View className="mr-3 flex-1">
                <Text
                  className="text-sm font-semibold text-gray-700"
                  numberOfLines={1}
                >
                  {selectedImage.fileName}
                </Text>
                {selectedImage.fileSize && (
                  <Text className="mt-0.5 text-xs text-gray-400">
                    {formatFileSize(selectedImage.fileSize)}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={handleClear}
                className="rounded-full bg-gray-100 px-3 py-1.5"
              >
                <Text className="text-xs font-medium text-gray-500">
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePickImage}
            className="mb-4 h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white"
            activeOpacity={0.7}
          >
            <View className="items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color="#e74c3c"
                />
              </View>
              <Text className="text-base font-semibold text-gray-700">
                Tap to select a cat image
              </Text>
              <Text className="text-sm text-gray-400">
                JPEG, PNG, GIF or WEBP
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {errors.length > 0 && (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <View className="mb-1 flex-row items-center gap-2">
              <Ionicons name="alert-circle-outline" size={18} color="#e74c3c" />
              <Text className="text-sm font-semibold text-red-500">
                Please fix the following:
              </Text>
            </View>
            {errors.map((error, index) => (
              <Text key={index} className="ml-6 mt-1 text-sm text-red-400">
                - {error}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleUpload}
          disabled={!selectedImage || isUploading}
          className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
            !selectedImage || isUploading ? "bg-gray-300" : "bg-red-500"
          }`}
        >
          {isUploading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-base font-semibold text-white">
                Uploading...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text className="text-base font-semibold text-white">
                Upload Cat
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isUploading}
          className="mt-3 items-center py-4"
        >
          <Text className="font-medium text-gray-400">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
