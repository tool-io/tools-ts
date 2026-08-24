import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarSmileBudgetInput = {
  readonly collimatorFocalLengthMm: number;
  readonly smileUm: number;
  readonly allowedPointingUrad: number;
  readonly workingDistanceMm?: number;
};

export type BarSmileBudgetOutput = {
  readonly pointingUrad: number;
  readonly withinBudget: boolean;
  readonly spotShiftMm: number;
};

/**
 * Smile curvature s displaced along the collimator focal plane tilts the
 * beam by theta ≈ s / f. The far-field spot then walks by theta × distance.
 */
export const barSmilePointing = (
  input: BarSmileBudgetInput,
): BarSmileBudgetOutput => {
  if (input.collimatorFocalLengthMm <= 0)
    simpleError(
      "collimatorFocalLengthMm",
      "Collimator focal length must be positive.",
    );
  if (input.smileUm < 0)
    simpleError("smileUm", "Smile height cannot be negative.");
  if (input.allowedPointingUrad < 0)
    simpleError(
      "allowedPointingUrad",
      "The pointing budget cannot be negative.",
    );
  const distance = input.workingDistanceMm ?? 1000;
  if (distance < 0)
    simpleError("workingDistanceMm", "Working distance cannot be negative.");
  const pointingUrad = (input.smileUm / input.collimatorFocalLengthMm) * 1000;
  return {
    pointingUrad,
    withinBudget: pointingUrad <= input.allowedPointingUrad,
    spotShiftMm: (pointingUrad * distance) / 1e6,
  };
};

export const barSmileBudgetExample = {
  input: {
    collimatorFocalLengthMm: 15,
    smileUm: 2,
    allowedPointingUrad: 100,
    workingDistanceMm: 1000,
  },
  output: {
    pointingUrad: (2 / 15) * 1000,
    withinBudget: false,
    spotShiftMm: ((2 / 15) * 1000 * 1000) / 1e6,
  },
} satisfies ToolExample<BarSmileBudgetInput, BarSmileBudgetOutput>;

export const barSmileBudgetTool = createSimpleTool({
  calculate: (input) =>
    barSmilePointing({
      allowedPointingUrad: input.allowedPointingUrad as number,
      collimatorFocalLengthMm: input.collimatorFocalLengthMm as number,
      smileUm: input.smileUm as number,
      workingDistanceMm: input.workingDistanceMm as number,
    }),
  description:
    "Translate the smile (emitter curvature) of a diode bar into far-field pointing error after collimation and check it against the budget.",
  id: "laser/laser-bar-array-smile-effect-beam-pointing-microradian-budget-checker",
  inputs: [
    {
      description: "Focal length of the fast- or slow-axis collimator.",
      id: "collimatorFocalLengthMm",
      kind: "number",
      label: "Collimator f",
      minimum: 0,
      unit: "mm",
    },
    {
      description: "Peak deviation of the emitter line from straight.",
      id: "smileUm",
      kind: "number",
      label: "Smile",
      minimum: 0,
      unit: "µm",
    },
    {
      description: "Allowed pointing error for the application.",
      id: "allowedPointingUrad",
      kind: "number",
      label: "Budget",
      minimum: 0,
      unit: "µrad",
    },
    {
      default: 1000,
      description: "Distance to the target where the walk-off matters.",
      id: "workingDistanceMm",
      kind: "number",
      label: "Working distance",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Beam tilt produced by the smile.",
      id: "pointingUrad",
      kind: "number",
      label: "Pointing",
      unit: "µrad",
    },
    {
      description: "Whether the tilt stays inside the allowed budget.",
      id: "withinBudget",
      kind: "boolean",
      label: "Within budget",
    },
    {
      description: "Spot walk-off at the working distance.",
      id: "spotShiftMm",
      kind: "number",
      label: "Spot shift",
      unit: "mm",
    },
  ],
  title: "Bar Smile Pointing Budget Checker",
});
export const runBarSmileBudget = barSmileBudgetTool.execute;
export default barSmileBudgetTool;

export { barSmileBudgetExample as example };
