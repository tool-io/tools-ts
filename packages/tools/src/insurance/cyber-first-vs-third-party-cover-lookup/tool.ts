import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  catalogIndex,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerCyberCostCategoryIds: readonly string[];
  readonly callerVerifiedFirstPartyFlags: readonly number[];
  readonly callerVerifiedThirdPartyFlags: readonly number[];
  readonly observedCyberCostCategoryIds: readonly string[];
  readonly observedCyberCostMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerFirstPartyCategorizedCostMinor: number;
  readonly callerThirdPartyCategorizedCostMinor: number;
  readonly callerBothPartyCategoryIds: readonly string[];
  readonly callerUnclassifiedCategoryIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCyberCostCategoryIds",
    label: "Caller cyber cost category ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFirstPartyFlags",
    label: "Caller verified first party flags",
    kind: "numberList",
  },
  {
    id: "callerVerifiedThirdPartyFlags",
    label: "Caller verified third party flags",
    kind: "numberList",
  },
  {
    id: "observedCyberCostCategoryIds",
    label: "Observed cyber cost category ids",
    kind: "stringList",
  },
  {
    id: "observedCyberCostMinor",
    label: "Observed cyber cost minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerCyberCostCategoryIds, "categories");
  aligned(
    input.callerCyberCostCategoryIds,
    input.callerVerifiedFirstPartyFlags,
    "catalog",
  );
  aligned(
    input.callerCyberCostCategoryIds,
    input.callerVerifiedThirdPartyFlags,
    "catalog",
  );
  aligned(
    input.observedCyberCostCategoryIds,
    input.observedCyberCostMinor,
    "costs",
  );
  binary(input.callerVerifiedFirstPartyFlags, "catalog");
  binary(input.callerVerifiedThirdPartyFlags, "catalog");
  input.observedCyberCostMinor.forEach((v) => money(v));
  const indices = input.observedCyberCostCategoryIds.map((v) =>
    catalogIndex(input.callerCyberCostCategoryIds, v),
  );
  return {
    callerFirstPartyCategorizedCostMinor: sumMoney(
      input.observedCyberCostMinor.filter(
        (_, i) => input.callerVerifiedFirstPartyFlags[indices[i]],
      ),
    ),
    callerThirdPartyCategorizedCostMinor: sumMoney(
      input.observedCyberCostMinor.filter(
        (_, i) => input.callerVerifiedThirdPartyFlags[indices[i]],
      ),
    ),
    callerBothPartyCategoryIds: input.observedCyberCostCategoryIds.filter(
      (_, i) =>
        input.callerVerifiedFirstPartyFlags[indices[i]] &&
        input.callerVerifiedThirdPartyFlags[indices[i]],
    ),
    callerUnclassifiedCategoryIds: input.observedCyberCostCategoryIds.filter(
      (_, i) =>
        !input.callerVerifiedFirstPartyFlags[indices[i]] &&
        !input.callerVerifiedThirdPartyFlags[indices[i]],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCyberCostCategoryIds: ["response", "liability"],
  callerVerifiedFirstPartyFlags: [1, 0],
  callerVerifiedThirdPartyFlags: [0, 1],
  observedCyberCostCategoryIds: ["response", "liability"],
  observedCyberCostMinor: [1000, 2000],
} satisfies Input;
export const exampleOutput = {
  callerFirstPartyCategorizedCostMinor: 1000,
  callerThirdPartyCategorizedCostMinor: 2000,
  callerBothPartyCategoryIds: [],
  callerUnclassifiedCategoryIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/cyber-first-vs-third-party-cover-lookup",
  title: "Cyber First vs Third Party Cover Lookup",
  description:
    "Allocate actual cyber cost categories using independent caller first/third-party maps, overlap explicitly reported and totals not summed blindly; no cyber policy coverage or incident causation conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFirstPartyCategorizedCostMinor",
      label: "Caller first party categorized cost minor",
      kind: "number",
    },
    {
      id: "callerThirdPartyCategorizedCostMinor",
      label: "Caller third party categorized cost minor",
      kind: "number",
    },
    {
      id: "callerBothPartyCategoryIds",
      label: "Caller both party category ids",
      kind: "stringList",
    },
    {
      id: "callerUnclassifiedCategoryIds",
      label: "Caller unclassified category ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCyberCostCategoryIds:
        value.callerCyberCostCategoryIds as readonly string[],
      callerVerifiedFirstPartyFlags:
        value.callerVerifiedFirstPartyFlags as readonly number[],
      callerVerifiedThirdPartyFlags:
        value.callerVerifiedThirdPartyFlags as readonly number[],
      observedCyberCostCategoryIds:
        value.observedCyberCostCategoryIds as readonly string[],
      observedCyberCostMinor: value.observedCyberCostMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
