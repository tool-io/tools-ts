export const convertLengthByFactors = (
  value: number,
  fromMeters: number,
  toMeters: number,
): number => (value * fromMeters) / toMeters;
