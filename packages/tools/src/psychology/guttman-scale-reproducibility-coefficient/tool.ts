import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCodedGuttmanErrorCount: number;
  readonly actualRespondentCount: number;
  readonly actualItemCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCodedGuttmanErrorCount",
    label: "Actual independently coded guttman error count",
    kind: "number",
  },
  {
    id: "actualRespondentCount",
    label: "Actual respondent count",
    kind: "number",
  },
  { id: "actualItemCount", label: "Actual item count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyCodedGuttmanErrorCount,
    "actualIndependentlyCodedGuttmanErrorCount",
    0,
    1000000,
  );
  bounded(input.actualRespondentCount, "actualRespondentCount", 1, 1000000);
  bounded(input.actualItemCount, "actualItemCount", 1, 1000000);
  if (
    input.actualIndependentlyCodedGuttmanErrorCount >
    input.actualRespondentCount * input.actualItemCount
  )
    simpleError("errors", "Errors within actual person item responses.");
  return {
    value:
      1 -
      input.actualIndependentlyCodedGuttmanErrorCount /
        (input.actualRespondentCount * input.actualItemCount),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyCodedGuttmanErrorCount: 2,
    actualRespondentCount: 5,
    actualItemCount: 4,
  },
  output: { result: { value: 0.9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/guttman-scale-reproducibility-coefficient",
  title: "Guttman Reproducibility Coefficient",
  description:
    "Declared Guttman reproducibility1\u2212errors/(persons\u00d7items), errors independently assigned under actual ordering. Not construct validity, scalogramoptimization or universal acceptable cutoff. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
