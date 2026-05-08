import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
      <View className="min-w-0 flex-1 flex-row items-center">
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
        )}
        <View className="min-w-0 flex-1">
          <Text className="text-2xl font-bold text-gray-900">{title}</Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text>
          )}
        </View>
      </View>
      {rightAction && <View className="ml-3">{rightAction}</View>}
    </View>
  );
}
