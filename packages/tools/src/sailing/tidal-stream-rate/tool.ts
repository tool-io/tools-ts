import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TidalStreamRateInput = {
  readonly driftDistanceNm: number;
  readonly timeElapsedHours: number;
};

export type TidalStreamRateOutput = {
  readonly rateKt: number;
};

export const tidalStreamRateExample = {
  input: { driftDistanceNm: 1.5, timeElapsedHours: 0.5 },
  output: { rateKt: 3 },
} satisfies ToolExample<TidalStreamRateInput, TidalStreamRateOutput>;

export const calculateTidalStreamRate = (
  input: TidalStreamRateInput,
): TidalStreamRateOutput => {
  if (!(input.driftDistanceNm >= 0))
    simpleError(
      "driftDistanceNm",
      "The drift distance must be non-negative.",
      "invalid_distance",
    );
  if (input.timeElapsedHours <= 0)
    simpleError(
      "timeElapsedHours",
      "The elapsed time must be positive.",
      "invalid_time",
    );
  return { rateKt: input.driftDistanceNm / input.timeElapsedHours };
};

export const tidalStreamRateTool = createSimpleTool({
  calculate: (input) =>
    calculateTidalStreamRate(input as unknown as TidalStreamRateInput),
  description:
    "Compute the tidal stream rate from the distance a free-floating object drifted and the elapsed time.",
  id: "sailing/tidal-stream-rate",
  inputs: [
    {
      description: "Distance the object drifted.",
      id: "driftDistanceNm",
      kind: "number",
      label: "Drift distance",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Time over which the drift was measured.",
      id: "timeElapsedHours",
      kind: "number",
      label: "Elapsed time",
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Tidal stream rate in knots.",
      format: "speed",
      id: "rateKt",
      kind: "number",
      label: "Tidal stream rate",
      unit: "kt",
    },
  ],
  title: "Tidal Stream Rate Calculator",
});
export const runTidalStreamRate = tidalStreamRateTool.execute;
export default tidalStreamRateTool;
