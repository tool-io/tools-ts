import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualScoreSd: number;
  readonly independentlyEstablishedReliability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualScoreSd", label: "Actual score sd", kind: "number" },
  {
    id: "independentlyEstablishedReliability",
    label: "Independently established reliability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualScoreSd, "actualScoreSd");
  fraction(
    input.independentlyEstablishedReliability,
    "independentlyEstablishedReliability",
  );
  return {
    value:
      input.actualScoreSd *
      Math.sqrt(1 - input.independentlyEstablishedReliability),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualScoreSd: 2, independentlyEstablishedReliability: 0.75 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/standard-error-of-measurement",
  title: "Standard Error of Measurement Calculator",
  description:
    "Classical SEMscoreSD\u221a(1\u2212reliability), not sample mean standarderrorSD/\u221an; actual reliability/form independently applicable. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
