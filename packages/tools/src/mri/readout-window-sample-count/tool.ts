import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly availableReadoutMs: number;
  readonly dwellMicroseconds: number;
}>;
export type Output = Readonly<{
  readonly completeSamples: number;
  readonly usedReadoutMs: number;
  readonly unusedWindowMs: number;
}>;
const inputFields = [
  {
    id: "availableReadoutMs",
    label: "Available readout ms",
    kind: "number",
    unit: "ms",
  },
  { id: "dwellMicroseconds", label: "Dwell microseconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.availableReadoutMs, "availableReadoutMs");
  positive(input.dwellMicroseconds, "dwellMicroseconds");
  const completeSamples = Math.floor(
    (input.availableReadoutMs * 1000) / input.dwellMicroseconds,
  );
  count(completeSamples, "availableReadoutMs", 1);
  const usedReadoutMs = (completeSamples * input.dwellMicroseconds) / 1000;
  return {
    completeSamples,
    usedReadoutMs,
    unusedWindowMs: input.availableReadoutMs - usedReadoutMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  availableReadoutMs: 2.565,
  dwellMicroseconds: 10,
} satisfies Input;
export const exampleOutput = {
  completeSamples: 256,
  usedReadoutMs: 2.56,
  unusedWindowMs: 0.005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/readout-window-sample-count",
  title: "Readout Matrix Size",
  description:
    "Fit complete ADC dwell intervals into a supplied readout window and retain the unused tail rather than rounding an infeasible fractional matrix size.",
  inputs: inputFields,
  outputs: [
    { id: "completeSamples", label: "Complete samples", kind: "number" },
    {
      id: "usedReadoutMs",
      label: "Used readout ms",
      kind: "number",
      unit: "ms",
    },
    {
      id: "unusedWindowMs",
      label: "Unused window ms",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (value) =>
    calculate({
      availableReadoutMs: value.availableReadoutMs as number,
      dwellMicroseconds: value.dwellMicroseconds as number,
    }),
});
export const run = tool.execute;
export default tool;
