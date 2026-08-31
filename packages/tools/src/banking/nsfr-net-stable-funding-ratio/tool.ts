import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  aligned,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly fundingCategoryAmountsMinor: readonly number[];
  readonly callerAsfWeightBasisPoints: readonly number[];
  readonly assetExposureAmountsMinor: readonly number[];
  readonly callerRsfWeightBasisPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledAvailableStableFundingMinor: number;
  readonly modeledRequiredStableFundingMinor: number;
  readonly modeledNsfrPercent: number;
}>;
const inputFields = [
  {
    id: "fundingCategoryAmountsMinor",
    label: "Funding category amounts minor",
    kind: "numberList",
  },
  {
    id: "callerAsfWeightBasisPoints",
    label: "Caller asf weight basis points",
    kind: "numberList",
  },
  {
    id: "assetExposureAmountsMinor",
    label: "Asset exposure amounts minor",
    kind: "numberList",
  },
  {
    id: "callerRsfWeightBasisPoints",
    label: "Caller rsf weight basis points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fundingCategoryAmountsMinor.forEach((v) =>
    money(v, "fundingCategoryAmountsMinor"),
  );
  input.assetExposureAmountsMinor.forEach((v) =>
    money(v, "assetExposureAmountsMinor"),
  );
  aligned(
    input.fundingCategoryAmountsMinor,
    input.callerAsfWeightBasisPoints,
    "fundingCategoryAmountsMinor",
  );
  aligned(
    input.assetExposureAmountsMinor,
    input.callerRsfWeightBasisPoints,
    "assetExposureAmountsMinor",
  );
  [
    ...input.callerAsfWeightBasisPoints,
    ...input.callerRsfWeightBasisPoints,
  ].forEach((v) => bounded(v, "factor", 0, 10000));
  const asf = sumMoney(
      input.fundingCategoryAmountsMinor.map((v, i) =>
        weightedMinor(v, input.callerAsfWeightBasisPoints[i], 10000),
      ),
    ),
    rsf = positive(
      sumMoney(
        input.assetExposureAmountsMinor.map((v, i) =>
          weightedMinor(v, input.callerRsfWeightBasisPoints[i], 10000),
        ),
      ),
      "requiredFunding",
    );
  return {
    modeledAvailableStableFundingMinor: asf,
    modeledRequiredStableFundingMinor: rsf,
    modeledNsfrPercent: (100 * asf) / rsf,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fundingCategoryAmountsMinor: [1000, 500],
  callerAsfWeightBasisPoints: [10000, 5000],
  assetExposureAmountsMinor: [1000, 200],
  callerRsfWeightBasisPoints: [8500, 10000],
} satisfies Input;
export const exampleOutput = {
  modeledAvailableStableFundingMinor: 1250,
  modeledRequiredStableFundingMinor: 1050,
  modeledNsfrPercent: 119.04761904761905,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/nsfr-net-stable-funding-ratio",
  title: "NSFR Net Stable Funding Ratio Calculator",
  description:
    "Aggregate actual caller funding/exposure categories with explicit ASF/RSF factors and per-category half-up rounding; no embedded maturity/classification tables, off-balance-sheet eligibility assumptions or supervisory NSFR compliance ruling.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledAvailableStableFundingMinor",
      label: "Modeled available stable funding minor",
      kind: "number",
    },
    {
      id: "modeledRequiredStableFundingMinor",
      label: "Modeled required stable funding minor",
      kind: "number",
    },
    { id: "modeledNsfrPercent", label: "Modeled nsfr percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fundingCategoryAmountsMinor:
        value.fundingCategoryAmountsMinor as readonly number[],
      callerAsfWeightBasisPoints:
        value.callerAsfWeightBasisPoints as readonly number[],
      assetExposureAmountsMinor:
        value.assetExposureAmountsMinor as readonly number[],
      callerRsfWeightBasisPoints:
        value.callerRsfWeightBasisPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
