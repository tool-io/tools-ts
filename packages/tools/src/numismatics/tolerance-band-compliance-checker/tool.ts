import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ordered } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedQuantity: number;
  readonly callerApplicableLower: number;
  readonly callerApplicableUpper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedQuantity", label: "Observed quantity", kind: "number" },
  {
    id: "callerApplicableLower",
    label: "Caller applicable lower",
    kind: "number",
  },
  {
    id: "callerApplicableUpper",
    label: "Caller applicable upper",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  ordered(input.callerApplicableLower, input.callerApplicableUpper);
  return {
    signedLowerMargin: input.observedQuantity - input.callerApplicableLower,
    signedUpperMargin: input.callerApplicableUpper - input.observedQuantity,
    withinCallerInclusiveBand:
      input.observedQuantity >= input.callerApplicableLower &&
      input.observedQuantity <= input.callerApplicableUpper,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedQuantity: 10,
    callerApplicableLower: 9.5,
    callerApplicableUpper: 10.5,
  },
  output: {
    result: {
      signedLowerMargin: 0.5,
      signedUpperMargin: 0.5,
      withinCallerInclusiveBand: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/tolerance-band-compliance-checker",
  title: "Tolerance Band Compliance Checker",
  description:
    "Compare actual issue-specific measured quantity with independently applicable same-unit inclusive tolerance band, retaining signed margins; not mint/service compliance or authentication.",
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
