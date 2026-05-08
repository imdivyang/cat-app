import {
  CatImage,
  Favourite,
  Vote,
  addFavourite,
  fetchFavourites,
  fetchUploadedImages,
  fetchVotes,
  removeFavourite,
  voteOnCat,
} from "@/api/cats";
import { catQueryKeys } from "@/api/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface FavouriteMap {
  [imageId: string]: number;
}

interface ScoreMap {
  [imageId: string]: number;
}

export const useCatGallery = () => {
  const queryClient = useQueryClient();

  // ── Per-card loading sets ──────────────────────────────
  const [favouritePendingIds, setFavouritePendingIds] = useState<Set<string>>(
    new Set(),
  );
  const [votePendingIds, setVotePendingIds] = useState<Set<string>>(new Set());
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // ── Queries ───────────────────────────────────────────

  const imagesQuery = useQuery({
    queryKey: catQueryKeys.images,
    queryFn: fetchUploadedImages,
  });
  const favouritesQuery = useQuery({
    queryKey: catQueryKeys.favourites,
    queryFn: fetchFavourites,
  });
  const votesQuery = useQuery({
    queryKey: catQueryKeys.votes,
    queryFn: fetchVotes,
  });

  const cats = imagesQuery.data ?? [];

  // ── Derived Maps ──────────────────────────────────────

  const favourites = useMemo(() => {
    const favMap: FavouriteMap = {};
    (favouritesQuery.data ?? []).forEach((fav) => {
      favMap[fav.image_id] = fav.id;
    });
    return favMap;
  }, [favouritesQuery.data]);

  const scores = useMemo(() => {
    const scoreMap: ScoreMap = {};
    (votesQuery.data ?? []).forEach((vote) => {
      scoreMap[vote.image_id] =
        (scoreMap[vote.image_id] ?? 0) + (vote.value === 1 ? 1 : -1);
    });
    return scoreMap;
  }, [votesQuery.data]);

  // ── Mutations ─────────────────────────────────────────

  const favouriteMutation = useMutation({
    mutationFn: async ({
      imageId,
      favouriteId,
    }: {
      imageId: string;
      favouriteId?: number;
    }) => {
      if (favouriteId) {
        await removeFavourite(favouriteId);
        return;
      }
      await addFavourite(imageId);
    },
    onMutate: async ({ imageId, favouriteId }) => {
      await queryClient.cancelQueries({ queryKey: catQueryKeys.favourites });

      const previousFavourites = queryClient.getQueryData<Favourite[]>(
        catQueryKeys.favourites,
      );

      queryClient.setQueryData<Favourite[]>(
        catQueryKeys.favourites,
        (current = []) => {
          if (favouriteId) {
            return current.filter((fav) => fav.id !== favouriteId);
          }
          return [
            ...current,
            {
              id: Date.now(),
              image_id: imageId,
              image: cats.find((cat) => cat.id === imageId),
            },
          ];
        },
      );

      return { previousFavourites };
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: catQueryKeys.favourites });
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(
        catQueryKeys.favourites,
        context?.previousFavourites,
      );
      console.error("Favourite error:", error);
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ imageId, value }: { imageId: string; value: 1 | 0 }) =>
      voteOnCat(imageId, value),
    onMutate: async ({ imageId, value }) => {
      await queryClient.cancelQueries({ queryKey: catQueryKeys.votes });

      const previousVotes = queryClient.getQueryData<Vote[]>(
        catQueryKeys.votes,
      );

      queryClient.setQueryData<Vote[]>(catQueryKeys.votes, (current = []) => [
        ...current,
        {
          id: Date.now(),
          image_id: imageId,
          value,
        },
      ]);

      return { previousVotes };
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: catQueryKeys.votes });
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(catQueryKeys.votes, context?.previousVotes);
      console.error("Vote error:", error);
    },
  });

  // ── Refresh ───────────────────────────────────────────

  const refreshAll = async () => {
    setIsManualRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: catQueryKeys.images }),
      queryClient.invalidateQueries({ queryKey: catQueryKeys.favourites }),
      queryClient.invalidateQueries({ queryKey: catQueryKeys.votes }),
    ]);
    setIsManualRefreshing(false);
  };

  // ── Actions with per-card loading ─────────────────────

  const toggleFavourite = async (imageId: string, favouriteId?: number) => {
    setFavouritePendingIds((prev) => new Set(prev).add(imageId));
    try {
      await favouriteMutation.mutateAsync({ imageId, favouriteId });
    } finally {
      setFavouritePendingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(imageId);
        return updated;
      });
    }
  };

  const vote = async (imageId: string, value: 1 | 0) => {
    setVotePendingIds((prev) => new Set(prev).add(imageId));
    try {
      await voteMutation.mutateAsync({ imageId, value });
    } finally {
      setVotePendingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(imageId);
        return updated;
      });
    }
  };

  // ── Return ────────────────────────────────────────────

  return {
    cats,
    favourites,
    scores,
    hasError:
      imagesQuery.isError || favouritesQuery.isError || votesQuery.isError,
    isInitialLoading:
      (imagesQuery.isLoading && !imagesQuery.data) ||
      (favouritesQuery.isLoading && !favouritesQuery.data) ||
      (votesQuery.isLoading && !votesQuery.data),
    isRefreshing: isManualRefreshing,
    favouritePendingIds,
    votePendingIds,
    refreshAll,
    toggleFavourite,
    vote,
  };
};

export type { CatImage };
