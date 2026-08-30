import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly considerationTransferredMinor: number;
  readonly nciFairValueMinor: number;
  readonly previouslyHeldInterestFairValueMinor: number;
  readonly identifiableAssetFairValuesMinor: readonly number[];
  readonly assumedLiabilityFairValuesMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly identifiableNetAssetsMinor: number;
  readonly totalAcquisitionMeasurementMinor: number;
  readonly modeledGoodwillMinor: number;
  readonly bargainPurchaseCandidateMinor: number;
}>;
const inputFields = [
  {
    id: "considerationTransferredMinor",
    label: "Consideration transferred minor",
    kind: "number",
  },
  { id: "nciFairValueMinor", label: "Nci fair value minor", kind: "number" },
  {
    id: "previouslyHeldInterestFairValueMinor",
    label: "Previously held interest fair value minor",
    kind: "number",
  },
  {
    id: "identifiableAssetFairValuesMinor",
    label: "Identifiable asset fair values minor",
    kind: "numberList",
  },
  {
    id: "assumedLiabilityFairValuesMinor",
    label: "Assumed liability fair values minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.considerationTransferredMinor, "considerationTransferredMinor");
  money(input.nciFairValueMinor, "nciFairValueMinor");
  money(
    input.previouslyHeldInterestFairValueMinor,
    "previouslyHeldInterestFairValueMinor",
  );
  input.identifiableAssetFairValuesMinor.forEach((v) =>
    money(v, "identifiableAssetFairValuesMinor"),
  );
  input.assumedLiabilityFairValuesMinor.forEach((v) =>
    money(v, "assumedLiabilityFairValuesMinor"),
  );
  const net = integer(
      sumMoney(input.identifiableAssetFairValuesMinor) -
        sumMoney(input.assumedLiabilityFairValuesMinor),
      "netAssets",
    ),
    purchase = sumMoney([
      input.considerationTransferredMinor,
      input.nciFairValueMinor,
      input.previouslyHeldInterestFairValueMinor,
    ]),
    difference = integer(purchase - net, "purchaseDifference");
  return {
    identifiableNetAssetsMinor: net,
    totalAcquisitionMeasurementMinor: purchase,
    modeledGoodwillMinor: Math.max(0, difference),
    bargainPurchaseCandidateMinor: Math.max(0, -difference),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  considerationTransferredMinor: 1000,
  nciFairValueMinor: 200,
  previouslyHeldInterestFairValueMinor: 50,
  identifiableAssetFairValuesMinor: [1000, 500],
  assumedLiabilityFairValuesMinor: [400],
} satisfies Input;
export const exampleOutput = {
  identifiableNetAssetsMinor: 1100,
  totalAcquisitionMeasurementMinor: 1250,
  modeledGoodwillMinor: 150,
  bargainPurchaseCandidateMinor: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/goodwill-purchase-price-allocation-acquisition",
  title: "Goodwill Purchase Price Allocation Acquisition Calculator",
  description:
    "Build caller full-fair-value purchase allocation including NCI and previously held interest; excess net assets remain bargain-purchase candidate pending reassessment, not automatically recognized gain or a valuation opinion.",
  inputs: inputFields,
  outputs: [
    {
      id: "identifiableNetAssetsMinor",
      label: "Identifiable net assets minor",
      kind: "number",
    },
    {
      id: "totalAcquisitionMeasurementMinor",
      label: "Total acquisition measurement minor",
      kind: "number",
    },
    {
      id: "modeledGoodwillMinor",
      label: "Modeled goodwill minor",
      kind: "number",
    },
    {
      id: "bargainPurchaseCandidateMinor",
      label: "Bargain purchase candidate minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      considerationTransferredMinor:
        value.considerationTransferredMinor as number,
      nciFairValueMinor: value.nciFairValueMinor as number,
      previouslyHeldInterestFairValueMinor:
        value.previouslyHeldInterestFairValueMinor as number,
      identifiableAssetFairValuesMinor:
        value.identifiableAssetFairValuesMinor as readonly number[],
      assumedLiabilityFairValuesMinor:
        value.assumedLiabilityFairValuesMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
