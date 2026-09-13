import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualPercentile: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPercentile", label: "Actual percentile", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualPercentile, "actualPercentile");
  if (input.actualPercentile > 100)
    simpleError("percentile", "Percentile0…100.");
  return {
    value:
      1 +
      [4, 11, 23, 40, 60, 77, 89, 96].filter((v) => input.actualPercentile >= v)
        .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPercentile: 50 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/stanine-band-from-percentile",
  title: "Stanine Band From Percentile Converter",
  description:
    "Declared stanine percentile breakpoints4,11,23,40,60,77,89,96, lower bound inclusive; convention approximate normal split, not an instrument norm. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
