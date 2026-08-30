import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentT2Ms: readonly number[];
  readonly componentAmplitudes: readonly number[];
  readonly shortT2UpperMs: number;
}>;
export type Output = Readonly<{
  readonly shortComponentAmplitude: number;
  readonly totalComponentAmplitude: number;
  readonly myelinWaterFraction: number;
}>;
const inputFields = [
  { id: "componentT2Ms", label: "Component t2 ms", kind: "numberList" },
  {
    id: "componentAmplitudes",
    label: "Component amplitudes",
    kind: "numberList",
  },
  { id: "shortT2UpperMs", label: "Short t2 upper ms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.componentT2Ms, input.componentAmplitudes, "componentT2Ms");
  ordered(input.componentT2Ms, "componentT2Ms");
  input.componentT2Ms.forEach((v) => positive(v, "componentT2Ms"));
  input.componentAmplitudes.forEach((v) =>
    nonnegative(v, "componentAmplitudes"),
  );
  positive(input.shortT2UpperMs, "shortT2UpperMs");
  const totalComponentAmplitude = positive(
      input.componentAmplitudes.reduce((a, b) => a + b, 0),
      "componentAmplitudes",
    ),
    shortComponentAmplitude = input.componentAmplitudes.reduce(
      (s, v, i) => s + (input.componentT2Ms[i] <= input.shortT2UpperMs ? v : 0),
      0,
    );
  return {
    shortComponentAmplitude,
    totalComponentAmplitude,
    myelinWaterFraction: shortComponentAmplitude / totalComponentAmplitude,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentT2Ms: [10, 30, 100],
  componentAmplitudes: [2, 3, 5],
  shortT2UpperMs: 40,
} satisfies Input;
export const exampleOutput = {
  shortComponentAmplitude: 5,
  totalComponentAmplitude: 10,
  myelinWaterFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/relaxometry-myelin-water-fraction",
  title: "Myelin Water Fraction",
  description:
    "Sum short-T2 component amplitudes relative to a supplied fitted relaxometry spectrum; the short-pool cutoff is caller supplied and amplitudes are not fitted here.",
  inputs: inputFields,
  outputs: [
    {
      id: "shortComponentAmplitude",
      label: "Short component amplitude",
      kind: "number",
    },
    {
      id: "totalComponentAmplitude",
      label: "Total component amplitude",
      kind: "number",
    },
    {
      id: "myelinWaterFraction",
      label: "Myelin water fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentT2Ms: value.componentT2Ms as readonly number[],
      componentAmplitudes: value.componentAmplitudes as readonly number[],
      shortT2UpperMs: value.shortT2UpperMs as number,
    }),
});
export const run = tool.execute;
export default tool;
