import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly focalLengthMillimeters: number;
  readonly scanAngleRadians: number;
  readonly measuredPositionMillimeters: number;
}>;
export type Output = Readonly<{
  readonly idealPositionMillimeters: number;
  readonly fieldErrorMillimeters: number;
  readonly relativeFieldErrorPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const idealPositionMillimeters =
    input.focalLengthMillimeters * input.scanAngleRadians;
  if (idealPositionMillimeters === 0)
    simpleError(
      "scanAngleRadians",
      "Ideal field position must be nonzero.",
      "invalid_reference",
    );
  const fieldErrorMillimeters =
    input.measuredPositionMillimeters - idealPositionMillimeters;
  return {
    idealPositionMillimeters,
    fieldErrorMillimeters,
    relativeFieldErrorPercent:
      (fieldErrorMillimeters / idealPositionMillimeters) * 100,
  };
};

export const exampleInput = {
  focalLengthMillimeters: 100,
  scanAngleRadians: 0.1,
  measuredPositionMillimeters: 11,
} satisfies Input;
export const exampleOutput = {
  idealPositionMillimeters: 10,
  fieldErrorMillimeters: 1,
  relativeFieldErrorPercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      focalLengthMillimeters: input.focalLengthMillimeters as number,
      scanAngleRadians: input.scanAngleRadians as number,
      measuredPositionMillimeters: input.measuredPositionMillimeters as number,
    }),
  description:
    "Compare measured scan position with the ideal f-theta field position.",
  id: "laser/f-theta-field-error",
  inputs: [
    {
      id: "focalLengthMillimeters",
      label: "F-theta focal length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "scanAngleRadians",
      label: "Scan angle",
      kind: "number",
      unit: "rad",
    },
    {
      id: "measuredPositionMillimeters",
      label: "Measured field position",
      kind: "number",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "idealPositionMillimeters",
      label: "Ideal f-theta position",
      kind: "number",
      unit: "mm",
    },
    {
      id: "fieldErrorMillimeters",
      label: "Field-position error",
      kind: "number",
      unit: "mm",
    },
    {
      id: "relativeFieldErrorPercent",
      label: "Relative field error",
      kind: "number",
      unit: "%",
    },
  ],
  title: "F-Theta Field Error",
});

export const run = tool.execute;
export default tool;
