import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedValue: number;
  readonly callerApplicableLowerReviewBound: number;
  readonly callerApplicableUpperReviewBound: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualObservedValue", label: "Actual observed value", kind: "number" },
  {
    id: "callerApplicableLowerReviewBound",
    label: "Caller applicable lower review bound",
    kind: "number",
  },
  {
    id: "callerApplicableUpperReviewBound",
    label: "Caller applicable upper review bound",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.callerApplicableLowerReviewBound >
    input.callerApplicableUpperReviewBound
  )
    simpleError(
      "bounds",
      "Actual ordered independently applicable matched-unit review bounds.",
    );
  return {
    withinCallerReviewBounds:
      input.actualObservedValue >= input.callerApplicableLowerReviewBound &&
      input.actualObservedValue <= input.callerApplicableUpperReviewBound,
    signedLowerMargin:
      input.actualObservedValue - input.callerApplicableLowerReviewBound,
    signedUpperMargin:
      input.callerApplicableUpperReviewBound - input.actualObservedValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedValue: 10,
    callerApplicableLowerReviewBound: 5,
    callerApplicableUpperReviewBound: 15,
  },
  output: {
    result: {
      withinCallerReviewBounds: true,
      signedLowerMargin: 5,
      signedUpperMargin: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/amikacin-level-checker",
  title: "Amikacin Level Checker",
  description:
    "Actual actual independently clinician interpreted Amikacin Level Checker with matched assay units, sampling time, formulation/route/indication and protocol versus independently applicable caller bounds, signed margins retained, inclusive end points. No universal threshold, diagnosis, eligibility, treatment adjustment, compliance or safe operating approval; actual units, protocol and applicability external.",
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
