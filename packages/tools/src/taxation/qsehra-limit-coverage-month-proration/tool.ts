import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  binary,
  sum,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerAnnualApplicableQsehraLimitMinor: number;
  readonly callerEligibleCoverageMonthFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly coveredMonths: number;
  readonly conditionalProratedLimitMinor: number;
}>;
const inputFields = [
  {
    id: "callerAnnualApplicableQsehraLimitMinor",
    label: "Caller annual applicable qsehra limit minor",
    kind: "number",
  },
  {
    id: "callerEligibleCoverageMonthFlags",
    label: "Caller eligible coverage month flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.callerAnnualApplicableQsehraLimitMinor,
    "callerAnnualApplicableQsehraLimitMinor",
  );
  binary(
    input.callerEligibleCoverageMonthFlags,
    "callerEligibleCoverageMonthFlags",
  );
  if (input.callerEligibleCoverageMonthFlags.length !== 12)
    simpleError("months", "Exactly12independently eligible month flags.");
  const m = sum(input.callerEligibleCoverageMonthFlags);
  return {
    coveredMonths: m,
    conditionalProratedLimitMinor: roundMinor(
      BigInt(input.callerAnnualApplicableQsehraLimitMinor) * BigInt(m),
      12n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnualApplicableQsehraLimitMinor: 100,
  callerEligibleCoverageMonthFlags: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
} satisfies Input;
export const exampleOutput = {
  coveredMonths: 6,
  conditionalProratedLimitMinor: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/qsehra-limit-coverage-month-proration",
  title: "QSEHRA Limit Coverage Month Proration Calculator",
  description:
    "Explicit eligible coverage months annual QSEHRA limit proration, no medical reimbursement exclusion eligibility inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "coveredMonths", label: "Covered months", kind: "number" },
    {
      id: "conditionalProratedLimitMinor",
      label: "Conditional prorated limit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnualApplicableQsehraLimitMinor:
        value.callerAnnualApplicableQsehraLimitMinor as number,
      callerEligibleCoverageMonthFlags:
        value.callerEligibleCoverageMonthFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
