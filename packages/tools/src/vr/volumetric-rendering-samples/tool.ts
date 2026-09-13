import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOpticalPathLength: number;
  readonly callerIndependentMaximumSamplingFrequencyPerLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOpticalPathLength",
    label: "Actual optical path length",
    kind: "number",
  },
  {
    id: "callerIndependentMaximumSamplingFrequencyPerLength",
    label: "Caller independent maximum sampling frequency per length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualOpticalPathLength, "actualOpticalPathLength");
  positive(
    input.callerIndependentMaximumSamplingFrequencyPerLength,
    "callerIndependentMaximumSamplingFrequencyPerLength",
  );
  return {
    value: Math.ceil(
      input.actualOpticalPathLength *
        input.callerIndependentMaximumSamplingFrequencyPerLength,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOpticalPathLength: 10,
    callerIndependentMaximumSamplingFrequencyPerLength: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/volumetric-rendering-samples",
  title: "Volumetric Rendering Samples Calculator",
  description:
    "Conditional volume samples budget ceil(path length\u00d7independent actual sampling frequency), not Beer\u2013Lambert absorption or automatic quality selection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
