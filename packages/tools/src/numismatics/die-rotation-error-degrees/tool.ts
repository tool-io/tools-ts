import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DieRotationErrorDegreesInput = Readonly<{
  readonly observedRotationDegrees: number;
  readonly expectedRotationDegrees: number;
}>;
export type DieRotationErrorDegreesOutput = Readonly<{
  readonly angularErrorDegrees: number;
}>;

export const calculateDieRotationErrorDegrees = (
  x: DieRotationErrorDegreesInput,
): DieRotationErrorDegreesOutput => {
  if (
    !Number.isFinite(x.observedRotationDegrees) ||
    x.observedRotationDegrees < 0
  )
    simpleError(
      "observedRotationDegrees",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.expectedRotationDegrees) ||
    x.expectedRotationDegrees < 0
  )
    simpleError(
      "expectedRotationDegrees",
      "Provide a finite nonnegative number.",
    );
  const angularErrorDegrees = Math.min(
    Math.abs(x.observedRotationDegrees - x.expectedRotationDegrees) % 360,
    360 -
      (Math.abs(x.observedRotationDegrees - x.expectedRotationDegrees) % 360),
  );
  if (!Number.isFinite(angularErrorDegrees))
    simpleError(
      "angularErrorDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    angularErrorDegrees: Object.is(angularErrorDegrees, -0)
      ? 0
      : angularErrorDegrees,
  };
};

export const example = {
  input: {
    observedRotationDegrees: 350,
    expectedRotationDegrees: 0,
  },
  output: { angularErrorDegrees: 10 },
} satisfies ToolExample<
  DieRotationErrorDegreesInput,
  DieRotationErrorDegreesOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/die-rotation-error-degrees",
  title: "Die Rotation Error Degrees",
  description:
    "Find the smallest angular deviation from the expected coin or medal alignment.",
  inputs: [
    {
      id: "observedRotationDegrees",
      kind: "number",
      label: "Observed Rotation Degrees",
      unit: "deg",
    },
    {
      id: "expectedRotationDegrees",
      kind: "number",
      label: "Expected Rotation Degrees",
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "angularErrorDegrees",
      kind: "number",
      label: "Angular Error Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateDieRotationErrorDegrees({
      observedRotationDegrees: input.observedRotationDegrees as number,
      expectedRotationDegrees: input.expectedRotationDegrees as number,
    }),
});
export const runDieRotationErrorDegrees = tool.execute;
export default tool;
