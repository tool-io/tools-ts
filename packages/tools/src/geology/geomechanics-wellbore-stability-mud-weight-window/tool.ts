import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredValue: number;
  readonly callerApplicableLowerReviewValue: number;
  readonly callerApplicableUpperReviewValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredValue",
    label: "Independently measured value",
    kind: "number",
  },
  {
    id: "callerApplicableLowerReviewValue",
    label: "Caller applicable lower review value",
    kind: "number",
  },
  {
    id: "callerApplicableUpperReviewValue",
    label: "Caller applicable upper review value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.callerApplicableUpperReviewValue <
    input.callerApplicableLowerReviewValue
  )
    simpleError("bounds", "Independent ordered matched-unit review bounds.");
  return {
    withinCallerReviewBounds:
      input.independentlyMeasuredValue >=
        input.callerApplicableLowerReviewValue &&
      input.independentlyMeasuredValue <=
        input.callerApplicableUpperReviewValue,
    signedLowerMargin:
      input.independentlyMeasuredValue - input.callerApplicableLowerReviewValue,
    signedUpperMargin:
      input.callerApplicableUpperReviewValue - input.independentlyMeasuredValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredValue: 10,
    callerApplicableLowerReviewValue: 5,
    callerApplicableUpperReviewValue: 15,
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
  id: "geology/geomechanics-wellbore-stability-mud-weight-window",
  title: "Geology Geomechanics Wellbore Stability Mud Weight Window Calculator",
  description:
    "Actual actual mud density versus independently modeled collapse/fracture review window with depth, pore pressure/stress and fluid convention externally resolved versus independently applicable ordered caller review bounds in same caller mud-density unit. Endpoints inclusive, all margins signed. No default benchmark, universal threshold, compliance, medical reassurance or safe operation approval; authoritative protocol/context and measurement uncertainty external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
