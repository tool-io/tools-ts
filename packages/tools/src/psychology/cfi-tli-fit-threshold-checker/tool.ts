import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCfi: number;
  readonly actualTli: number;
  readonly callerApplicableCfiLowerReviewBound: number;
  readonly callerApplicableTliLowerReviewBound: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCfi", label: "Actual cfi", kind: "number" },
  { id: "actualTli", label: "Actual tli", kind: "number" },
  {
    id: "callerApplicableCfiLowerReviewBound",
    label: "Caller applicable cfi lower review bound",
    kind: "number",
  },
  {
    id: "callerApplicableTliLowerReviewBound",
    label: "Caller applicable tli lower review bound",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    cfiMeetsCallerCriterion:
      input.actualCfi >= input.callerApplicableCfiLowerReviewBound,
    tliMeetsCallerCriterion:
      input.actualTli >= input.callerApplicableTliLowerReviewBound,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCfi: 0.95,
    actualTli: 0.94,
    callerApplicableCfiLowerReviewBound: 0.9,
    callerApplicableTliLowerReviewBound: 0.9,
  },
  output: {
    result: { cfiMeetsCallerCriterion: true, tliMeetsCallerCriterion: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/cfi-tli-fit-threshold-checker",
  title: "CFI/TLI Fit Threshold Checker",
  description:
    "Actual separately independently fit CFIandTLIversus matched caller review bounds, no fabricated universal fit threshold or model truth; unclipped fit indexes can exceed conventional0\u20131.",
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
