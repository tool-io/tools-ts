import { simpleError } from "../core/simple.js";
export {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  ordered,
  mean,
  variance,
  regression,
  integral,
  quantile,
  norm,
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
import { ordered, aligned } from "../neuroscience/shared.js";
export const thermalIntegral = (
  timesDays: readonly number[],
  temperaturesC: readonly number[],
  baseC: number,
): number => {
  ordered(timesDays, "timesDays");
  aligned(timesDays, temperaturesC, "timesDays");
  let sum = 0;
  for (let i = 1; i < timesDays.length; i++) {
    const a = temperaturesC[i - 1] - baseC,
      b = temperaturesC[i] - baseC,
      dt = timesDays[i] - timesDays[i - 1];
    sum +=
      a >= 0 && b >= 0
        ? (dt * (a + b)) / 2
        : a <= 0 && b <= 0
          ? 0
          : (dt * Math.max(a, b) ** 2) / (2 * Math.abs(b - a));
  }
  return sum;
};
export const binary = (x: readonly number[], f: string): void => {
  if (!x.length || x.some((v) => v !== 0 && v !== 1))
    simpleError(f, "A nonempty binary flag list required.");
};
