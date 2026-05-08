import { API_KEY, BASE_URL } from "@/constants/config";
import { create } from "axios";
import { Platform } from "react-native";

const catApiClient = create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export interface Favourite {
  id: number;
  image_id: string;
  image?: CatImage;
}

export interface Vote {
  id: number;
  image_id: string;
  value: number;
}

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export const fetchUploadedImages = async (): Promise<CatImage[]> => {
  const response = await catApiClient.get("/images", {
    params: { limit: 20, order: "DESC" },
  });
  return response.data;
};

export const uploadCatImage = async (file: UploadFile): Promise<CatImage> => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const fileResponse = await fetch(file.uri);
    const blob = await fileResponse.blob();
    formData.append("file", blob, file.name);
  } else {
    formData.append("file", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
  }

  const response = await catApiClient.post("/images/upload", formData);
  return response.data;
};

export const fetchFavourites = async (): Promise<Favourite[]> => {
  const response = await catApiClient.get("/favourites");
  return response.data;
};

export const addFavourite = async (
  imageId: string,
): Promise<{ id: number }> => {
  const response = await catApiClient.post("/favourites", {
    image_id: imageId,
  });
  return response.data;
};

export const removeFavourite = async (favouriteId: number): Promise<void> => {
  await catApiClient.delete(`/favourites/${favouriteId}`);
};

export const fetchVotes = async (): Promise<Vote[]> => {
  const response = await catApiClient.get("/votes");
  return response.data;
};

export const voteOnCat = async (
  imageId: string,
  value: 1 | 0,
): Promise<void> => {
  await catApiClient.post("/votes", { image_id: imageId, value });
};
