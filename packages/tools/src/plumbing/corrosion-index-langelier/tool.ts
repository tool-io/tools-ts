import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPh: readonly number[];
  readonly callerMatchedSaturationPh: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerMatchedIndexValues: readonly number[];
}>;
const inputFields = [
  { id: "observedPh", label: "Observed ph", kind: "numberList" },
  {
    id: "callerMatchedSaturationPh",
    label: "Caller matched saturation ph",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observedPh, input.callerMatchedSaturationPh, "observedPh");
  [...input.observedPh, ...input.callerMatchedSaturationPh].forEach((v) => {
    if (v < 0 || v > 14)
      simpleError("pH", "Explicit matched pH in [0,14] required.");
  });
  return {
    callerMatchedIndexValues: input.observedPh.map(
      (v, i) => v - input.callerMatchedSaturationPh[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPh: [8, 7],
  callerMatchedSaturationPh: [7.5, 7.5],
} satisfies Input;
export const exampleOutput = {
  callerMatchedIndexValues: [0.5, -0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/corrosion-index-langelier",
  title: "Plumbing Corrosion Index Langelier Calculator",
  description:
    "Compute named Langelier index from actual pH and independently established matched saturation pH; does not infer saturation chemistry, corrosion rate or universal aggressive/scaling classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedIndexValues",
      label: "Caller matched index values",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPh: value.observedPh as readonly number[],
      callerMatchedSaturationPh:
        value.callerMatchedSaturationPh as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
