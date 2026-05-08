import CatCard from "@/components/CatCard";
import PageHeader from "@/components/PageHeader";
import { CatImage, useCatGallery } from "@/hooks/use-cat-gallery";
import { useResponsiveCatGrid } from "@/hooks/use-responsive-cat-grid";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingState = () => (
  <SafeAreaView
    className="flex-1 items-center justify-center bg-gray-100"
    edges={["top", "bottom"]}
  >
    <ActivityIndicator size="large" color="#e74c3c" />
    <Text className="mt-3 text-base text-gray-400">Loading cats...</Text>
  </SafeAreaView>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <SafeAreaView
    className="flex-1 items-center justify-center gap-3 bg-gray-100 px-6"
    edges={["top", "bottom"]}
  >
    <Ionicons name="cloud-offline-outline" size={48} color="#ccc" />
    <Text className="text-center text-base text-red-500">
      Failed to load cats. Pull down to retry.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      className="mt-2 rounded-full bg-red-500 px-6 py-2.5"
    >
      <Text className="font-semibold text-white">Retry</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const EmptyState = ({ onUpload }: { onUpload: () => void }) => (
  <View className="flex-1 items-center justify-center px-6">
    <Ionicons name="images-outline" size={48} color="#ccc" />
    <Text className="mt-3 text-xl font-bold text-gray-800">No cats yet</Text>
    <Text className="mt-1 text-center text-sm text-gray-400">
      Upload your first cat to get started.
    </Text>
    <TouchableOpacity
      onPress={onUpload}
      className="mt-5 rounded-full bg-red-500 px-6 py-3"
    >
      <Text className="text-base font-semibold text-white">Upload a Cat</Text>
    </TouchableOpacity>
  </View>
);

export default function CatGalleryScreen() {
  const router = useRouter();
  const { cardWidth, gap, numColumns, padding } = useResponsiveCatGrid();
  const {
    cats,
    favourites,
    hasError,
    isFavouritePending,
    isInitialLoading,
    isRefreshing,
    isVotePending,
    refreshAll,
    scores,
    toggleFavourite,
    vote,
  } = useCatGallery();

  const goToUpload = () => router.push("/upload");

  const renderCat = ({ item }: { item: CatImage }) => (
    <CatCard
      cat={item}
      isFavourited={!!favourites[item.id]}
      favouriteId={favourites[item.id]}
      score={scores[item.id] ?? 0}
      cardWidth={cardWidth}
      favLoading={isFavouritePending}
      voteLoading={isVotePending}
      onFavouriteToggle={toggleFavourite}
      onVote={vote}
    />
  );

  if (isInitialLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState onRetry={refreshAll} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
      <PageHeader
        title="Cats"
        subtitle="Your uploaded cat images"
        rightAction={
          <TouchableOpacity
            onPress={goToUpload}
            className="h-11 w-11 items-center justify-center rounded-full bg-red-500"
            accessibilityLabel="Upload cat"
          >
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={renderCat}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={
          numColumns > 1
            ? { justifyContent: "space-between", paddingHorizontal: padding }
            : undefined
        }
        contentContainerStyle={{
          flexGrow: 1,
          gap,
          paddingTop: padding,
          paddingBottom: 32,
          paddingHorizontal: numColumns === 1 ? padding : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor="#e74c3c"
          />
        }
        ListEmptyComponent={<EmptyState onUpload={goToUpload} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
