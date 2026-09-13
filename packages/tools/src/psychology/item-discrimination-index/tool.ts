import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualUpperGroupCorrect: number;
  readonly actualUpperGroupEligible: number;
  readonly actualLowerGroupCorrect: number;
  readonly actualLowerGroupEligible: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUpperGroupCorrect",
    label: "Actual upper group correct",
    kind: "number",
  },
  {
    id: "actualUpperGroupEligible",
    label: "Actual upper group eligible",
    kind: "number",
  },
  {
    id: "actualLowerGroupCorrect",
    label: "Actual lower group correct",
    kind: "number",
  },
  {
    id: "actualLowerGroupEligible",
    label: "Actual lower group eligible",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualUpperGroupCorrect, "actualUpperGroupCorrect", 0, 1000000);
  bounded(
    input.actualUpperGroupEligible,
    "actualUpperGroupEligible",
    1,
    1000000,
  );
  bounded(input.actualLowerGroupCorrect, "actualLowerGroupCorrect", 0, 1000000);
  bounded(
    input.actualLowerGroupEligible,
    "actualLowerGroupEligible",
    1,
    1000000,
  );
  if (
    input.actualUpperGroupCorrect > input.actualUpperGroupEligible ||
    input.actualLowerGroupCorrect > input.actualLowerGroupEligible
  )
    simpleError("counts", "Correct≤eligible.");
  return {
    value:
      input.actualUpperGroupCorrect / input.actualUpperGroupEligible -
      input.actualLowerGroupCorrect / input.actualLowerGroupEligible,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUpperGroupCorrect: 3,
    actualUpperGroupEligible: 4,
    actualLowerGroupCorrect: 1,
    actualLowerGroupEligible: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/item-discrimination-index",
  title: "Item Discrimination Index Calculator",
  description:
    "Actual item discrimination difference upper minus lower independent group correct proportions, not infer statistical group validity. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
