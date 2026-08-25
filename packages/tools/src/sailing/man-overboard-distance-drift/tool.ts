import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManOverboardDistanceDriftInput = {
  readonly currentKt: number;
  readonly elapsedMinutes: number;
  readonly windKt: number;
  readonly windageFactor?: number;
};

export type ManOverboardDistanceDriftOutput = {
  readonly driftDistanceNm: number;
};

const DEFAULT_WINDAGE_FACTOR = 0.02;

export const calculateManOverboardDistanceDrift = (
  input: ManOverboardDistanceDriftInput,
): ManOverboardDistanceDriftOutput | null => {
  const windageFactor = input.windageFactor ?? DEFAULT_WINDAGE_FACTOR;
  const hours = input.elapsedMinutes / 60;
  return Number.isFinite(hours) &&
    Number.isFinite(input.currentKt) &&
    Number.isFinite(input.windKt) &&
    Number.isFinite(windageFactor) &&
    input.elapsedMinutes >= 0 &&
    input.currentKt >= 0 &&
    input.windKt >= 0 &&
    windageFactor >= 0
    ? {
        driftDistanceNm:
          hours * input.currentKt + windageFactor * input.windKt * hours,
      }
    : null;
};

export const manOverboardDistanceDriftExample = {
  input: { currentKt: 2, elapsedMinutes: 30, windKt: 20 },
  output: { driftDistanceNm: 1.2 },
} satisfies ToolExample<
  ManOverboardDistanceDriftInput,
  ManOverboardDistanceDriftOutput
>;

export const manOverboardDistanceDriftTool = createSimpleTool({
  id: "sailing/man-overboard-distance-drift",
  title: "MOB Drift Distance",
  description:
    "Estimate the maximum down-drift distance when current and windage act in the same direction. Vector set and wind directions are required for a position estimate.",
  inputs: [
    {
      description: "Minutes elapsed since the person went overboard.",
      id: "elapsedMinutes",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "min",
    },
    {
      description: "Current strength at the drift position.",
      id: "currentKt",
      kind: "number",
      label: "Current",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Wind speed driving windage drift.",
      id: "windKt",
      kind: "number",
      label: "Wind",
      minimum: 0,
      unit: "kt",
    },
    {
      default: DEFAULT_WINDAGE_FACTOR,
      description:
        "Fraction of the wind speed converted to drift per hour of exposure.",
      id: "windageFactor",
      kind: "number",
      label: "Windage factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Distance between the casualty and the starting position.",
      format: "length-nm",
      id: "driftDistanceNm",
      kind: "number",
      label: "Drift distance",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const driftDistanceNm = calculateManOverboardDistanceDrift(
      input as unknown as ManOverboardDistanceDriftInput,
    );
    if (driftDistanceNm === null)
      simpleError(
        "elapsedMinutes",
        "Time, current, and wind must be finite and not negative.",
        "invalid_value",
      );
    return driftDistanceNm;
  },
});

export const runManOverboardDistanceDrift =
  manOverboardDistanceDriftTool.execute;
export default manOverboardDistanceDriftTool;
