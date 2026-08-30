import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly hrfSamples: readonly number[];
  readonly sampleIntervalSeconds: number;
}>;
export type Output = Readonly<{
  readonly temporalDerivative: readonly number[];
}>;
const inputFields = [
  { id: "hrfSamples", label: "Hrf samples", kind: "numberList" },
  {
    id: "sampleIntervalSeconds",
    label: "Sample interval seconds",
    kind: "number",
    unit: "s",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.hrfSamples.length < 2)
    simpleError("hrfSamples", "At least two HRF samples required.");
  positive(input.sampleIntervalSeconds, "sampleIntervalSeconds");
  return {
    temporalDerivative: input.hrfSamples.map((_, i) =>
      i === 0
        ? (input.hrfSamples[1] - input.hrfSamples[0]) /
          input.sampleIntervalSeconds
        : i === input.hrfSamples.length - 1
          ? (input.hrfSamples[i] - input.hrfSamples[i - 1]) /
            input.sampleIntervalSeconds
          : (input.hrfSamples[i + 1] - input.hrfSamples[i - 1]) /
            (2 * input.sampleIntervalSeconds),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hrfSamples: [0, 1, 4],
  sampleIntervalSeconds: 1,
} satisfies Input;
export const exampleOutput = { temporalDerivative: [1, 2, 3] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/hrf-temporal-finite-difference",
  title: "Temporal Derivative HRF",
  description:
    "Differentiate a supplied HRF with centered interior differences and one-sided endpoints; this is the time derivative, not an automatically orthogonalized GLM basis.",
  inputs: inputFields,
  outputs: [
    {
      id: "temporalDerivative",
      label: "Temporal derivative",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      hrfSamples: value.hrfSamples as readonly number[],
      sampleIntervalSeconds: value.sampleIntervalSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
