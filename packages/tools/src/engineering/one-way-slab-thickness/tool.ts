import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly clearSpanM: number;
  readonly callerIndependentlyVerifiedSpanThicknessRatio: number;
}>;
export type Output = Readonly<{
  readonly callerRatioMinimumSlabThicknessM: number;
}>;
const inputFields = [
  { id: "clearSpanM", label: "Clear span m", kind: "number" },
  {
    id: "callerIndependentlyVerifiedSpanThicknessRatio",
    label: "Caller independently verified span thickness ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.clearSpanM, "clearSpanM");
  positive(
    input.callerIndependentlyVerifiedSpanThicknessRatio,
    "callerIndependentlyVerifiedSpanThicknessRatio",
  );
  return {
    callerRatioMinimumSlabThicknessM:
      input.clearSpanM / input.callerIndependentlyVerifiedSpanThicknessRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clearSpanM: 4,
  callerIndependentlyVerifiedSpanThicknessRatio: 20,
} satisfies Input;
export const exampleOutput = {
  callerRatioMinimumSlabThicknessM: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/one-way-slab-thickness",
  title: "One-Way Slab Thickness Calculator",
  description:
    "Evaluate independently verified same-boundary one-way slab span/thickness policy only, not flexural capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRatioMinimumSlabThicknessM",
      label: "Caller ratio minimum slab thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      clearSpanM: value.clearSpanM as number,
      callerIndependentlyVerifiedSpanThicknessRatio:
        value.callerIndependentlyVerifiedSpanThicknessRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
