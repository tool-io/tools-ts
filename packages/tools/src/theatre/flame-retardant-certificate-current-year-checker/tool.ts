import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedCertificateYear: number;
  readonly callerRequiredCertificateYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedCertificateYear",
    label: "Independently verified certificate year",
    kind: "number",
  },
  {
    id: "callerRequiredCertificateYear",
    label: "Caller required certificate year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.independentlyVerifiedCertificateYear,
    "certificateyear",
    1,
    9999,
  );
  bounded(input.callerRequiredCertificateYear, "policyyear", 1, 9999);
  return {
    matchesCallerYear:
      input.independentlyVerifiedCertificateYear ===
      input.callerRequiredCertificateYear,
    signedCertificateYearDifference:
      input.independentlyVerifiedCertificateYear -
      input.callerRequiredCertificateYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedCertificateYear: 2025,
    callerRequiredCertificateYear: 2026,
  },
  output: {
    result: { matchesCallerYear: false, signedCertificateYearDifference: -1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/flame-retardant-certificate-current-year-checker",
  title: "Flame Retardant Certificate Current Year Checker",
  description:
    "Exact certificate-year comparison against independently applicable caller policy; no assumption certificates expire annually or that date proves treatment/material compliance.",
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
