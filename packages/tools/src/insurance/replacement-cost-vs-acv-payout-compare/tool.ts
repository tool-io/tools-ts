import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerReplacementCostMinor: number;
  readonly callerVerifiedDepreciationMinor: number;
  readonly callerDeductibleMinor: number;
  readonly callerLimitMinor: number;
  readonly callerReplacementEvidenceVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerAcvPaymentMinor: number;
  readonly callerReplacementPotentialMinor: number;
  readonly callerRecoverableDepreciationMinor: number;
  readonly callerCurrentEvidencePaymentMinor: number;
}>;
const inputFields = [
  {
    id: "callerReplacementCostMinor",
    label: "Caller replacement cost minor",
    kind: "number",
  },
  {
    id: "callerVerifiedDepreciationMinor",
    label: "Caller verified depreciation minor",
    kind: "number",
  },
  {
    id: "callerDeductibleMinor",
    label: "Caller deductible minor",
    kind: "number",
  },
  { id: "callerLimitMinor", label: "Caller limit minor", kind: "number" },
  {
    id: "callerReplacementEvidenceVerified",
    label: "Caller replacement evidence verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerReplacementCostMinor,
    input.callerVerifiedDepreciationMinor,
    input.callerDeductibleMinor,
    input.callerLimitMinor,
  ].forEach((v) => money(v));
  if (input.callerVerifiedDepreciationMinor > input.callerReplacementCostMinor)
    simpleError(
      "depreciation",
      "Verified depreciation exceeds replacement value.",
    );
  const acv = Math.min(
      input.callerLimitMinor,
      Math.max(
        0,
        input.callerReplacementCostMinor -
          input.callerVerifiedDepreciationMinor -
          input.callerDeductibleMinor,
      ),
    ),
    rcv = Math.min(
      input.callerLimitMinor,
      Math.max(
        0,
        input.callerReplacementCostMinor - input.callerDeductibleMinor,
      ),
    );
  return {
    callerAcvPaymentMinor: acv,
    callerReplacementPotentialMinor: rcv,
    callerRecoverableDepreciationMinor: rcv - acv,
    callerCurrentEvidencePaymentMinor: input.callerReplacementEvidenceVerified
      ? rcv
      : acv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReplacementCostMinor: 10000,
  callerVerifiedDepreciationMinor: 3000,
  callerDeductibleMinor: 1000,
  callerLimitMinor: 20000,
  callerReplacementEvidenceVerified: false,
} satisfies Input;
export const exampleOutput = {
  callerAcvPaymentMinor: 6000,
  callerReplacementPotentialMinor: 9000,
  callerRecoverableDepreciationMinor: 3000,
  callerCurrentEvidencePaymentMinor: 6000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/replacement-cost-vs-acv-payout-compare",
  title: "Replacement Cost vs ACV Payout Compare Tool",
  description:
    "Compare caller explicitly deductible-before-limit ACV/RCV scenarios with independent replacement-evidence gate; no insurer valuation default or legal recoverable-depreciation entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAcvPaymentMinor",
      label: "Caller acv payment minor",
      kind: "number",
    },
    {
      id: "callerReplacementPotentialMinor",
      label: "Caller replacement potential minor",
      kind: "number",
    },
    {
      id: "callerRecoverableDepreciationMinor",
      label: "Caller recoverable depreciation minor",
      kind: "number",
    },
    {
      id: "callerCurrentEvidencePaymentMinor",
      label: "Caller current evidence payment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReplacementCostMinor: value.callerReplacementCostMinor as number,
      callerVerifiedDepreciationMinor:
        value.callerVerifiedDepreciationMinor as number,
      callerDeductibleMinor: value.callerDeductibleMinor as number,
      callerLimitMinor: value.callerLimitMinor as number,
      callerReplacementEvidenceVerified:
        value.callerReplacementEvidenceVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
