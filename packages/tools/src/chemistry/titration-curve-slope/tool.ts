import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const TitrationCurveSlopeTool = createSimpleTool({
  id: "chemistry/titration-curve-slope",
  title: "Titration Curve Slope Calculator",
  description: "Compute dpH/dV slope at given point during titration.",
  inputs: [
    { id: "deltaPh", label: "dpH", kind: "number" },
    { id: "deltaVolumeML", label: "dV", kind: "number" },
  ],
  outputs: [{ id: "slope", label: "dpH/dV", kind: "number" }],
  calculate: (input) => {
    const dv = input.deltaVolumeML as number;
    if (dv === 0) simpleError("deltaVolumeML", "Cannot be zero.", "invalid_dv");
    return { slope: (input.deltaPh as number) / dv };
  },
});
export default TitrationCurveSlopeTool;
export const runTitrationCurveSlope = TitrationCurveSlopeTool.execute;

export type TitrationCurveSlopeInput = {
  readonly deltaPh: number;
  readonly deltaVolumeML: number;
};

export type TitrationCurveSlopeOutput = {
  readonly slope: number;
};

export const titrationCurveSlopeExample = {
  input: {
    deltaPh: 1,
    deltaVolumeML: 1,
  },
  output: {
    slope: 1,
  },
} satisfies ToolExample<TitrationCurveSlopeInput, TitrationCurveSlopeOutput>;
