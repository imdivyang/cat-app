import { useWindowDimensions } from "react-native";

const GAP = 12;
const PADDING = 16;

const getNumColumns = (width: number): number => {
  if (width >= 900) return 4;
  if (width >= 600) return 3;
  if (width >= 400) return 2;
  return 1;
};

export const useResponsiveCatGrid = () => {
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);
  const cardWidth = (width - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  return {
    cardWidth,
    gap: GAP,
    numColumns,
    padding: PADDING,
  };
};
