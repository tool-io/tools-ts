import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly requestedGrantAmount: number;
  readonly cashContributionAmounts: readonly number[];
  readonly callerCashEligibilityFlags: readonly number[];
  readonly declaredInKindContributionAmounts: readonly number[];
  readonly callerInKindRecognizedFractions: readonly number[];
  readonly callerRequiredMatchPerGrantRatio: number;
  readonly callerMaximumInKindShareOfRequiredMatch: number;
}>;
export type Output = Readonly<{
  readonly recognizedEligibleCash: number;
  readonly uncappedRecognizedInKind: number;
  readonly acceptedInKindUnderCallerCap: number;
  readonly requiredMatchAmount: number;
  readonly signedMatchAmountMargin: number;
  readonly recognizedMatchPerGrantRatio: number;
  readonly meetsCallerFundingMatchPolicy: boolean;
}>;
const inputFields = [
  {
    id: "requestedGrantAmount",
    label: "Requested grant amount",
    kind: "number",
  },
  {
    id: "cashContributionAmounts",
    label: "Cash contribution amounts",
    kind: "numberList",
  },
  {
    id: "callerCashEligibilityFlags",
    label: "Caller cash eligibility flags",
    kind: "numberList",
  },
  {
    id: "declaredInKindContributionAmounts",
    label: "Declared in-kind contribution amounts",
    kind: "numberList",
  },
  {
    id: "callerInKindRecognizedFractions",
    label: "Caller in-kind recognized fractions",
    kind: "numberList",
  },
  {
    id: "callerRequiredMatchPerGrantRatio",
    label: "Caller required match per grant ratio",
    kind: "number",
  },
  {
    id: "callerMaximumInKindShareOfRequiredMatch",
    label: "Caller maximum in-kind share of required match",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  positive(input.requestedGrantAmount, "requestedGrantAmount");
  nonnegative(
    input.callerRequiredMatchPerGrantRatio,
    "callerRequiredMatchPerGrantRatio",
  );
  fraction(
    input.callerMaximumInKindShareOfRequiredMatch,
    "callerMaximumInKindShareOfRequiredMatch",
  );
  aligned(
    input.cashContributionAmounts,
    input.callerCashEligibilityFlags,
    "cash",
  );
  aligned(
    input.declaredInKindContributionAmounts,
    input.callerInKindRecognizedFractions,
    "inKind",
  );
  binary(input.callerCashEligibilityFlags, "eligibility");
  input.cashContributionAmounts.forEach((v) => nonnegative(v, "cash"));
  input.declaredInKindContributionAmounts.forEach((v) =>
    nonnegative(v, "inKind"),
  );
  input.callerInKindRecognizedFractions.forEach((v) =>
    fraction(v, "recognizedFraction"),
  );
  const recognizedEligibleCash = input.cashContributionAmounts.reduce(
      (s, v, i) => s + v * input.callerCashEligibilityFlags[i],
      0,
    ),
    uncappedRecognizedInKind = input.declaredInKindContributionAmounts.reduce(
      (s, v, i) => s + v * input.callerInKindRecognizedFractions[i],
      0,
    ),
    requiredMatchAmount =
      input.requestedGrantAmount * input.callerRequiredMatchPerGrantRatio;
  if (
    !Number.isFinite(uncappedRecognizedInKind) ||
    !Number.isFinite(requiredMatchAmount)
  )
    simpleError(
      "funding",
      "Finite recognized funding and required match required.",
    );
  const acceptedInKindUnderCallerCap = Math.min(
      uncappedRecognizedInKind,
      requiredMatchAmount * input.callerMaximumInKindShareOfRequiredMatch,
    ),
    recognized = recognizedEligibleCash + acceptedInKindUnderCallerCap,
    signedMatchAmountMargin = recognized - requiredMatchAmount;
  return finish({
    recognizedEligibleCash,
    uncappedRecognizedInKind,
    acceptedInKindUnderCallerCap,
    requiredMatchAmount,
    signedMatchAmountMargin,
    recognizedMatchPerGrantRatio: recognized / input.requestedGrantAmount,
    meetsCallerFundingMatchPolicy: signedMatchAmountMargin >= 0,
  });
};
export const exampleInput = {
  requestedGrantAmount: 1000,
  cashContributionAmounts: [100, 200],
  callerCashEligibilityFlags: [1, 0],
  declaredInKindContributionAmounts: [400, 100],
  callerInKindRecognizedFractions: [0.5, 1],
  callerRequiredMatchPerGrantRatio: 0.5,
  callerMaximumInKindShareOfRequiredMatch: 0.4,
} satisfies Input;
export const exampleOutput = {
  recognizedEligibleCash: 100,
  uncappedRecognizedInKind: 300,
  acceptedInKindUnderCallerCap: 200,
  requiredMatchAmount: 500,
  signedMatchAmountMargin: -200,
  recognizedMatchPerGrantRatio: 0.3,
  meetsCallerFundingMatchPolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/grant-match-ratio-checker",
  title: "Grant Match Funding Ratio Compliance Checker",
  description:
    "Reconcile caller eligible cash and independently valued in-kind support with a cap defined as share of required match, retaining excluded support and signed funding shortfall; unlike tested grant-cost allowability, this audits funding leverage, not legal compliance or award eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "recognizedEligibleCash",
      label: "Recognized eligible cash",
      kind: "number",
    },
    {
      id: "uncappedRecognizedInKind",
      label: "Uncapped recognized in-kind",
      kind: "number",
    },
    {
      id: "acceptedInKindUnderCallerCap",
      label: "Accepted in-kind under caller cap",
      kind: "number",
    },
    {
      id: "requiredMatchAmount",
      label: "Required match amount",
      kind: "number",
    },
    {
      id: "signedMatchAmountMargin",
      label: "Signed match amount margin",
      kind: "number",
    },
    {
      id: "recognizedMatchPerGrantRatio",
      label: "Recognized match per grant ratio",
      kind: "number",
    },
    {
      id: "meetsCallerFundingMatchPolicy",
      label: "Meets caller funding match policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedGrantAmount: value.requestedGrantAmount as number,
      cashContributionAmounts:
        value.cashContributionAmounts as readonly number[],
      callerCashEligibilityFlags:
        value.callerCashEligibilityFlags as readonly number[],
      declaredInKindContributionAmounts:
        value.declaredInKindContributionAmounts as readonly number[],
      callerInKindRecognizedFractions:
        value.callerInKindRecognizedFractions as readonly number[],
      callerRequiredMatchPerGrantRatio:
        value.callerRequiredMatchPerGrantRatio as number,
      callerMaximumInKindShareOfRequiredMatch:
        value.callerMaximumInKindShareOfRequiredMatch as number,
    }),
});
export const run = tool.execute;
export default tool;
