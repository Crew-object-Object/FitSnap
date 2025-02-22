const SIZE_MAP: Record<string, number> = {
  XXS: 1,
  XS: 2,
  S: 3,
  M: 4,
  L: 5,
  XL: 6,
  XXL: 7,
};

const REVERSE_SIZE_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(SIZE_MAP).map(([key, value]) => [value, key])
);

function getAverageSize(sizes: string[]): string | null {
  if (sizes.length === 0) return null;

  const sizeValues = sizes
    .map((size) => SIZE_MAP[size])
    .filter((val) => val !== undefined);

  if (sizeValues.length === 0) return null;

  const avgSizeIndex = Math.round(
    sizeValues.reduce((sum, val) => sum + val, 0) / sizeValues.length
  );

  return REVERSE_SIZE_MAP[avgSizeIndex] || null;
}
