import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly blankAfterHighArea: number;
  readonly highCalibratorArea: number;
  readonly maximumCarryoverPercent: number;
}>;
export type Output = Readonly<{
  readonly carryoverPercent: number;
  readonly exceedsLimit: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.blankAfterHighArea < 0 || input.highCalibratorArea <= 0)
    simpleError("highCalibratorArea", "High calibrator area must be positive.");
  const carryoverPercent =
    (input.blankAfterHighArea / input.highCalibratorArea) * 100;
  return {
    carryoverPercent,
    exceedsLimit: carryoverPercent > input.maximumCarryoverPercent,
  };
};
export const exampleInput = {
  blankAfterHighArea: 2,
  highCalibratorArea: 100,
  maximumCarryoverPercent: 1,
} satisfies Input;
export const exampleOutput = {
  carryoverPercent: 2,
  exceedsLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/carryover-residual",
  title: "Carryover Residual",
  description: "Measure blank-after-high calibrator carryover percentage.",
  inputs: [
    {
      id: "blankAfterHighArea",
      kind: "number",
      label: "Blank after high area",
    },
    { id: "highCalibratorArea", kind: "number", label: "High calibrator area" },
    {
      id: "maximumCarryoverPercent",
      kind: "number",
      label: "Maximum carryover percent",
    },
  ],
  outputs: [
    { id: "carryoverPercent", kind: "number", label: "Carryover percent" },
    { id: "exceedsLimit", kind: "boolean", label: "Exceeds limit" },
  ],
  calculate: (value) =>
    calculate({
      blankAfterHighArea: value.blankAfterHighArea as number,
      highCalibratorArea: value.highCalibratorArea as number,
      maximumCarryoverPercent: value.maximumCarryoverPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
