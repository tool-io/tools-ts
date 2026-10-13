import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredValue: number;
  readonly callerApplicableLowerBound: number;
  readonly callerApplicableUpperBound: number;
}>;
export type Output = ReturnType<typeof calculate>;
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
const compute = (input: Input) => {
  if (input.callerApplicableLowerBound > input.callerApplicableUpperBound)
    simpleError("bounds", "Actual ordered independently applicable bounds.");
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
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
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
  id: "construction/drywall-ceiling-sag-check",
  title: "Drywall Ceiling Sag Check",
  description:
    "Actual actual drywall ceiling sag under matched survey/load conditions versus independently applicable matched-unit caller bounds, inclusive end points, signed discrepancies. No universal cutoff, inferred discomfort, clinical diagnosis, compliance or safe operation determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          withinCallerBounds: { type: "boolean" },
          signedLowerMargin: { type: "number" },
          signedUpperMargin: { type: "number" },
        },
        required: [
          "withinCallerBounds",
          "signedLowerMargin",
          "signedUpperMargin",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
