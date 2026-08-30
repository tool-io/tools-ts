import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResidualAmplitudeInput = Readonly<{
  readonly initialDegrees: number;
  readonly declineDegrees: number;
}>;
export type ResidualAmplitudeOutput = Readonly<{
  readonly remainingDegrees: number;
}>;

export const calculateResidualAmplitude = (
  x: ResidualAmplitudeInput,
): ResidualAmplitudeOutput => {
  if (!Number.isFinite(x.initialDegrees) || x.initialDegrees < 0)
    simpleError("initialDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.declineDegrees) || x.declineDegrees < 0)
    simpleError("declineDegrees", "Provide a finite nonnegative number.");
  if (!(x.declineDegrees <= x.initialDegrees))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const remainingDegrees = x.initialDegrees - x.declineDegrees;
  if (!Number.isFinite(remainingDegrees))
    simpleError(
      "remainingDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    remainingDegrees: Object.is(remainingDegrees, -0) ? 0 : remainingDegrees,
  };
};

export const example = {
  input: {
    initialDegrees: 300,
    declineDegrees: 20,
  },
  output: { remainingDegrees: 280 },
} satisfies ToolExample<ResidualAmplitudeInput, ResidualAmplitudeOutput>;

export const tool = createSimpleTool({
  id: "horology/residual-amplitude",
  title: "Residual Amplitude",
  description:
    "Remaining balance amplitude after subtracting a measured angular decline from the starting amplitude.",
  inputs: [
    {
      id: "initialDegrees",
      kind: "number",
      label: "Initial Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "declineDegrees",
      kind: "number",
      label: "Decline Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "remainingDegrees",
      kind: "number",
      label: "Remaining Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateResidualAmplitude({
      initialDegrees: input.initialDegrees as number,
      declineDegrees: input.declineDegrees as number,
    }),
});
export const residualAmplitudeTool = tool;
export const runResidualAmplitude = tool.execute;
export default tool;
