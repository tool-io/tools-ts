import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly disclosedAprPercent: number;
  readonly independentlyCalculatedAprPercent: number;
  readonly callerApplicableTolerancePercentagePoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "disclosedAprPercent", label: "Disclosed apr percent", kind: "number" },
  {
    id: "independentlyCalculatedAprPercent",
    label: "Independently calculated apr percent",
    kind: "number",
  },
  {
    id: "callerApplicableTolerancePercentagePoints",
    label: "Caller applicable tolerance percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.disclosedAprPercent, "APR");
  nonnegative(input.independentlyCalculatedAprPercent, "APR");
  nonnegative(input.callerApplicableTolerancePercentagePoints, "tolerance");
  const d = input.disclosedAprPercent - input.independentlyCalculatedAprPercent;
  return {
    signedAprDifferencePercentagePoints: d,
    withinCallerTolerance:
      Math.abs(d) <= input.callerApplicableTolerancePercentagePoints,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    disclosedAprPercent: 6.12,
    independentlyCalculatedAprPercent: 6,
    callerApplicableTolerancePercentagePoints: 0.125,
  },
  output: {
    result: {
      signedAprDifferencePercentagePoints: 0.12,
      withinCallerTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reg-z-apr-tolerance-disclosure-checker",
  title: "Reg Z APR Tolerance Disclosure Checker",
  description:
    "Compare actual independently calculated APR with disclosed APR under caller independently applicable tolerance in percentage points; not an APR solver, selection of Reg Ztolerance, TRID cure determination or compliance certification.",
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
