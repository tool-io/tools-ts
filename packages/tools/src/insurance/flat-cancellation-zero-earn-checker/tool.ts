import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRiskAttachmentEvidenceAvailable: boolean;
  readonly observedRiskEverAttached: boolean;
  readonly observedClaimsExist: boolean;
  readonly callerFlatCancellationAllowed: boolean;
  readonly observedPremiumPaidMinor: number;
  readonly callerNonrefundableFlatFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly callerZeroEarnFlatCancellationEvidenced: boolean;
  readonly callerModeledFlatReturnMinor: number;
}>;
const inputFields = [
  {
    id: "observedRiskAttachmentEvidenceAvailable",
    label: "Observed risk attachment evidence available",
    kind: "boolean",
  },
  {
    id: "observedRiskEverAttached",
    label: "Observed risk ever attached",
    kind: "boolean",
  },
  {
    id: "observedClaimsExist",
    label: "Observed claims exist",
    kind: "boolean",
  },
  {
    id: "callerFlatCancellationAllowed",
    label: "Caller flat cancellation allowed",
    kind: "boolean",
  },
  {
    id: "observedPremiumPaidMinor",
    label: "Observed premium paid minor",
    kind: "number",
  },
  {
    id: "callerNonrefundableFlatFeeMinor",
    label: "Caller nonrefundable flat fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedPremiumPaidMinor);
  money(input.callerNonrefundableFlatFeeMinor);
  const flat =
    input.observedRiskAttachmentEvidenceAvailable &&
    !input.observedRiskEverAttached &&
    !input.observedClaimsExist &&
    input.callerFlatCancellationAllowed;
  return {
    callerZeroEarnFlatCancellationEvidenced: flat,
    callerModeledFlatReturnMinor: flat
      ? Math.max(
          0,
          input.observedPremiumPaidMinor -
            input.callerNonrefundableFlatFeeMinor,
        )
      : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRiskAttachmentEvidenceAvailable: true,
  observedRiskEverAttached: false,
  observedClaimsExist: false,
  callerFlatCancellationAllowed: true,
  observedPremiumPaidMinor: 10000,
  callerNonrefundableFlatFeeMinor: 100,
} satisfies Input;
export const exampleOutput = {
  callerZeroEarnFlatCancellationEvidenced: true,
  callerModeledFlatReturnMinor: 9900,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/flat-cancellation-zero-earn-checker",
  title: "Flat Cancellation Zero Earn Checker",
  description:
    "Audit independently available risk-attachment/claims evidence and caller flat-cancellation permission, then conditional zero-earned refund scenario; no absent evidence proves no risk or legal refund entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerZeroEarnFlatCancellationEvidenced",
      label: "Caller zero earn flat cancellation evidenced",
      kind: "boolean",
    },
    {
      id: "callerModeledFlatReturnMinor",
      label: "Caller modeled flat return minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRiskAttachmentEvidenceAvailable:
        value.observedRiskAttachmentEvidenceAvailable as boolean,
      observedRiskEverAttached: value.observedRiskEverAttached as boolean,
      observedClaimsExist: value.observedClaimsExist as boolean,
      callerFlatCancellationAllowed:
        value.callerFlatCancellationAllowed as boolean,
      observedPremiumPaidMinor: value.observedPremiumPaidMinor as number,
      callerNonrefundableFlatFeeMinor:
        value.callerNonrefundableFlatFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
