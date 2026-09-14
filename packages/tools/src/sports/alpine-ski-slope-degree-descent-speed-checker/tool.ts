import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredValue: number;
  readonly callerApplicableLowerBound: number;
  readonly callerApplicableUpperBound: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMeasuredValue", label: "Actual measured value", kind: "number" },
  {
    id: "callerApplicableLowerBound",
    label: "Caller applicable lower bound",
    kind: "number",
  },
  {
    id: "callerApplicableUpperBound",
    label: "Caller applicable upper bound",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (input.callerApplicableLowerBound > input.callerApplicableUpperBound)
    simpleError("bounds", "Independentlyapplicableorderedactualbounds.");
  return {
    withinCallerBounds:
      input.actualMeasuredValue >= input.callerApplicableLowerBound &&
      input.actualMeasuredValue <= input.callerApplicableUpperBound,
    signedLowerMargin:
      input.actualMeasuredValue - input.callerApplicableLowerBound,
    signedUpperMargin:
      input.callerApplicableUpperBound - input.actualMeasuredValue,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMeasuredValue: 10,
    callerApplicableLowerBound: 5,
    callerApplicableUpperBound: 15,
  },
  output: {
    result: {
      withinCallerBounds: true,
      signedLowerMargin: 5,
      signedUpperMargin: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/alpine-ski-slope-degree-descent-speed-checker",
  title: "Alpine Descent Speed Slope-Degree Checker",
  description:
    "Actual actualmeasureddescentspeed undermatchedslope/exposure versusindependentlyapplicable reviewbounds;not safedescentguarantee against independently applicable matched-unit callerbounds,inclusive endpoints,signed discrepancies. No universalcutoff,diagnosis,eligibility,operational safety or compliance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
