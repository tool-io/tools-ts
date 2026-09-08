import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, daysBetween } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRightsReviewDate: string;
  readonly callerIndependentlyEstablishedPublicDomainBoundaryDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedRightsReviewDate",
    label: "Caller verified rights review date",
    kind: "string",
  },
  {
    id: "callerIndependentlyEstablishedPublicDomainBoundaryDate",
    label: "Caller independently established public domain boundary date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(
    input.callerIndependentlyEstablishedPublicDomainBoundaryDate,
    input.callerVerifiedRightsReviewDate,
  );
  return {
    atOrAfterCallerRightsBoundary: d >= 0,
    signedDaysAfterCallerBoundary: d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedRightsReviewDate: "2026-01-01",
    callerIndependentlyEstablishedPublicDomainBoundaryDate: "2026-01-01",
  },
  output: {
    result: {
      atOrAfterCallerRightsBoundary: true,
      signedDaysAfterCallerBoundary: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/public-domain-boundary-checker",
  title: "Copyright Status Public Domain Year Boundary Checker",
  description:
    "Compare actual date with independently qualified-lawyer/source established work/jurisdiction copyright boundary. No universal publication-year cutoff, automatic public-domain status, foreign/restored rights, privacy, trademark or permissions determination.",
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
