import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly classOneEligibleCount: number;
  readonly classOneVoterCount: number;
  readonly classTwoEligibleCount: number;
  readonly classTwoVoterCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "classOneEligibleCount",
    label: "Class one eligible count",
    kind: "number",
  },
  { id: "classOneVoterCount", label: "Class one voter count", kind: "number" },
  {
    id: "classTwoEligibleCount",
    label: "Class two eligible count",
    kind: "number",
  },
  { id: "classTwoVoterCount", label: "Class two voter count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.classOneEligibleCount, "eligible");
  positive(input.classTwoEligibleCount, "eligible");
  if (
    input.classOneVoterCount < 0 ||
    input.classOneVoterCount > input.classOneEligibleCount ||
    input.classTwoVoterCount < 0 ||
    input.classTwoVoterCount > input.classTwoEligibleCount
  )
    simpleError("voters", "Observed voters within eligible cohorts.");
  return {
    observedTurnoutGapPercentagePoints:
      100 *
      (input.classOneVoterCount / input.classOneEligibleCount -
        input.classTwoVoterCount / input.classTwoEligibleCount),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    classOneEligibleCount: 100,
    classOneVoterCount: 60,
    classTwoEligibleCount: 100,
    classTwoVoterCount: 80,
  },
  output: { result: { observedTurnoutGapPercentagePoints: -20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/class-voting-turnout-differential",
  title: "Class Voting Turnout Differential Calculator",
  description:
    "Actual compatible class-cohort turnout difference, one minus two; classes independently assigned without inferential profiling, not a causal class-voting effect.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
