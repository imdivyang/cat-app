import { CatImage } from "@/api/cats";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── Types ──────────────────────────────────────────────

interface CatCardProps {
  cat: CatImage;
  isFavourited: boolean;
  favouriteId?: number;
  score: number;
  cardWidth: number;
  favLoading?: boolean;
  voteLoading?: boolean;
  onFavouriteToggle: (imageId: string, favouriteId?: number) => void;
  onVote: (imageId: string, value: 1 | 0) => void;
}

export default function CatCard({
  cat,
  isFavourited,
  favouriteId,
  score,
  cardWidth,
  favLoading = false,
  voteLoading = false,
  onFavouriteToggle,
  onVote,
}: CatCardProps) {
  const handleFavourite = () => {
    if (favLoading) return;
    if (isFavourited && favouriteId) {
      onFavouriteToggle(cat.id, favouriteId);
    } else {
      onFavouriteToggle(cat.id);
    }
  };

  const handleVote = (value: 1 | 0) => {
    if (voteLoading) return;
    onVote(cat.id, value);
  };

  return (
    <View
      style={{ width: cardWidth }}
      className="bg-white rounded-2xl mb-3 overflow-hidden shadow-sm"
    >
      {/* Cat Image */}
      <View style={{ height: cardWidth }}>
        <Image
          source={{ uri: cat.url }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Favourite Button */}
      <TouchableOpacity
        onPress={handleFavourite}
        disabled={favLoading}
        className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5"
      >
        {favLoading ? (
          <ActivityIndicator size="small" color="#e74c3c" />
        ) : (
          <Ionicons
            name={isFavourited ? "heart" : "heart-outline"}
            size={22}
            color="#e74c3c"
          />
        )}
      </TouchableOpacity>

      {/* Bottom Row — Votes & Score */}
      <View className="flex-row items-center justify-between px-3 py-2.5">
        {/* Vote Down */}
        <TouchableOpacity
          onPress={() => handleVote(0)}
          disabled={voteLoading}
          className="p-1"
        >
          <Ionicons
            name="arrow-down-circle-outline"
            size={26}
            color="#e74c3c"
          />
        </TouchableOpacity>

        {/* Score */}
        <View className="items-center">
          <Text className="text-base font-bold text-gray-800">{score}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">score</Text>
        </View>

        {/* Vote Up */}
        <TouchableOpacity
          onPress={() => handleVote(1)}
          disabled={voteLoading}
          className="p-1"
        >
          <Ionicons name="arrow-up-circle-outline" size={26} color="#2ecc71" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
