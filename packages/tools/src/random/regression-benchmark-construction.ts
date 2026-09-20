import { simpleError } from "../core/simple.js";
import { generatedLinearValue } from "./drawing-construction.js";
export const generatedPredictorGrid = (
  count: number,
  minimum: number,
  maximum: number,
): number[] => {
  if (!(minimum < maximum))
    return simpleError(
      "maximumX",
      "Predictor bounds must be strictly increasing.",
      "invalid_predictor_range",
    );
  const xs = Array.from({ length: count }, (_, i) =>
    generatedLinearValue(minimum, maximum, i / (count - 1), "maximumX"),
  );
  xs[0] = minimum;
  xs[xs.length - 1] = maximum;
  if (xs.some((value, i) => i > 0 && value <= xs[i - 1]))
    return simpleError(
      "count",
      "Predictor positions collapse at floating-point precision.",
      "collapsed_coordinate_grid",
    );
  return xs;
};
