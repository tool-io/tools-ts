import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BackBearingCalculatorInput = Readonly<{
  readonly forwardAzimuthDegrees: number;
}>;
export type BackBearingCalculatorOutput = Readonly<{
  readonly backAzimuthDegrees: number;
}>;

export const calculateBackBearingCalculator = (
  x: BackBearingCalculatorInput,
): BackBearingCalculatorOutput => {
  if (!Number.isFinite(x.forwardAzimuthDegrees) || x.forwardAzimuthDegrees < 0)
    simpleError(
      "forwardAzimuthDegrees",
      "Provide a finite nonnegative number.",
    );
  if (!(x.forwardAzimuthDegrees < 360))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const backAzimuthDegrees = (x.forwardAzimuthDegrees + 180) % 360;
  if (!Number.isFinite(backAzimuthDegrees))
    simpleError(
      "backAzimuthDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    backAzimuthDegrees: Object.is(backAzimuthDegrees, -0)
      ? 0
      : backAzimuthDegrees,
  };
};

export const example = {
  input: {
    forwardAzimuthDegrees: 45,
  },
  output: { backAzimuthDegrees: 225 },
} satisfies ToolExample<
  BackBearingCalculatorInput,
  BackBearingCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "cartography/back-bearing-calculator",
  title: "Back Bearing Calculator",
  description:
    "Reverse azimuth, normalized to [0,360), from a forward azimuth in degrees.",
  inputs: [
    {
      id: "forwardAzimuthDegrees",
      kind: "number",
      label: "Forward Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "backAzimuthDegrees",
      kind: "number",
      label: "Back Azimuth Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateBackBearingCalculator({
      forwardAzimuthDegrees: input.forwardAzimuthDegrees as number,
    }),
});
export const backBearingCalculatorTool = tool;
export const runBackBearingCalculator = tool.execute;
export default tool;
