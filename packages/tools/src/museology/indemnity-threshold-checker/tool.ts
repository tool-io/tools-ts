import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, signedSum } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedDeclaredValueMinor: number;
  readonly callerApplicableMinimumValueMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedDeclaredValueMinor",
    label: "Independently verified declared value minor",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumValueMinor",
    label: "Caller applicable minimum value minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.independentlyVerifiedDeclaredValueMinor, "value");
  money(input.callerApplicableMinimumValueMinor, "floor");
  return {
    meetsCallerValueScreen:
      input.independentlyVerifiedDeclaredValueMinor >=
      input.callerApplicableMinimumValueMinor,
    signedValueThresholdDifferenceMinor: signedSum([
      input.independentlyVerifiedDeclaredValueMinor,
      -input.callerApplicableMinimumValueMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedDeclaredValueMinor: 1000,
    callerApplicableMinimumValueMinor: 500,
  },
  output: {
    result: {
      meetsCallerValueScreen: true,
      signedValueThresholdDifferenceMinor: 500,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/indemnity-threshold-checker",
  title: "Indemnity Scheme Eligibility Value Threshold Checker",
  description:
    "Exact independently applicable indemnity value-floor screen only. Actual programme rules, objects, security, loans and eligibility remain externally verified; value does not establish coverage or approval.",
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
