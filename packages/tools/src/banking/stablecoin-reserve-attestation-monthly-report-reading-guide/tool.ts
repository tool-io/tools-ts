import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedCriterionFlags: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCriterionFlags",
    label: "Observed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionKnownFlags",
    label: "Criterion known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return annotatedChecklist(
    [
      "report date and covered entity identified",
      "attestation versus audit scope distinguished",
      "reserve asset categories verified",
      "liability basis and reconciliation reviewed",
      "restrictions and qualifications recorded",
    ],
    input.observedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedCriterionFlags: [1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "report date and covered entity identified",
        "attestation versus audit scope distinguished",
        "reserve asset categories verified",
        "liability basis and reconciliation reviewed",
        "restrictions and qualifications recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/stablecoin-reserve-attestation-monthly-report-reading-guide",
  title: "Stablecoin Reserve Attestation Monthly Report Reading Guide",
  description:
    "Record stablecoin reserve-report reading evidence; attestations do not automatically establish solvency, redeemability or asset ownership. Independently witnessed columns in order: report date and covered entity identified, attestation versus audit scope distinguished, reserve asset categories verified, liability basis and reconciliation reviewed, restrictions and qualifications recorded. Missing and unknown remain distinct; this is not legal compliance, coverage, authenticity or safety certification.",
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
