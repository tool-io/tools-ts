import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCorrectResponseCount: number;
  readonly actualEligibleResponseCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCorrectResponseCount",
    label: "Actual correct response count",
    kind: "number",
  },
  {
    id: "actualEligibleResponseCount",
    label: "Actual eligible response count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualCorrectResponseCount,
    "actualCorrectResponseCount",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleResponseCount,
    "actualEligibleResponseCount",
    1,
    1000000,
  );
  if (input.actualCorrectResponseCount > input.actualEligibleResponseCount)
    simpleError("counts", "Correct≤eligible.");
  return {
    value: input.actualCorrectResponseCount / input.actualEligibleResponseCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCorrectResponseCount: 2, actualEligibleResponseCount: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/item-difficulty-pvalue",
  title: "Item Difficulty p-Value Calculator",
  description:
    "Actual item difficulty pvalue=fraction correct, NOTa statistical significance pvalue. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
