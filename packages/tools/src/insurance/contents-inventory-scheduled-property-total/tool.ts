import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedItemIds: readonly string[];
  readonly callerItemReplacementMinor: readonly number[];
  readonly callerScheduledItemFlags: readonly number[];
  readonly itemValuationEvidenceFlags: readonly number[];
  readonly callerVerifiedScheduleLimitsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownScheduledPropertyValueMinor: number;
  readonly knownUnscheduledPropertyValueMinor: number;
  readonly scheduledItemsWithoutValueEvidence: readonly string[];
  readonly knownScheduleLimitDeficitItemIds: readonly string[];
}>;
const inputFields = [
  { id: "observedItemIds", label: "Observed item ids", kind: "stringList" },
  {
    id: "callerItemReplacementMinor",
    label: "Caller item replacement minor",
    kind: "numberList",
  },
  {
    id: "callerScheduledItemFlags",
    label: "Caller scheduled item flags",
    kind: "numberList",
  },
  {
    id: "itemValuationEvidenceFlags",
    label: "Item valuation evidence flags",
    kind: "numberList",
  },
  {
    id: "callerVerifiedScheduleLimitsMinor",
    label: "Caller verified schedule limits minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.observedItemIds, "items");
  aligned(input.observedItemIds, input.callerItemReplacementMinor, "items");
  aligned(input.observedItemIds, input.callerScheduledItemFlags, "items");
  aligned(input.observedItemIds, input.itemValuationEvidenceFlags, "items");
  aligned(
    input.observedItemIds,
    input.callerVerifiedScheduleLimitsMinor,
    "items",
  );
  binary(input.callerScheduledItemFlags, "scheduled");
  binary(input.itemValuationEvidenceFlags, "evidence");
  [
    ...input.callerItemReplacementMinor,
    ...input.callerVerifiedScheduleLimitsMinor,
  ].forEach((v) => money(v));
  return {
    knownScheduledPropertyValueMinor: sumMoney(
      input.callerItemReplacementMinor.filter(
        (_, i) =>
          input.callerScheduledItemFlags[i] &&
          input.itemValuationEvidenceFlags[i],
      ),
    ),
    knownUnscheduledPropertyValueMinor: sumMoney(
      input.callerItemReplacementMinor.filter(
        (_, i) =>
          !input.callerScheduledItemFlags[i] &&
          input.itemValuationEvidenceFlags[i],
      ),
    ),
    scheduledItemsWithoutValueEvidence: input.observedItemIds.filter(
      (_, i) =>
        input.callerScheduledItemFlags[i] &&
        !input.itemValuationEvidenceFlags[i],
    ),
    knownScheduleLimitDeficitItemIds: input.observedItemIds.filter(
      (_, i) =>
        input.callerScheduledItemFlags[i] &&
        input.itemValuationEvidenceFlags[i] &&
        input.callerItemReplacementMinor[i] >
          input.callerVerifiedScheduleLimitsMinor[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedItemIds: ["ring", "chair", "watch"],
  callerItemReplacementMinor: [1000, 500, 2000],
  callerScheduledItemFlags: [1, 0, 1],
  itemValuationEvidenceFlags: [1, 1, 0],
  callerVerifiedScheduleLimitsMinor: [1200, 0, 1500],
} satisfies Input;
export const exampleOutput = {
  knownScheduledPropertyValueMinor: 1000,
  knownUnscheduledPropertyValueMinor: 500,
  scheduledItemsWithoutValueEvidence: ["watch"],
  knownScheduleLimitDeficitItemIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/contents-inventory-scheduled-property-total",
  title: "Contents Inventory Scheduled Property Total Tool",
  description:
    "Audit actual property inventory by explicit schedule/value evidence and independently verified item limits, preserving unvalued items; not appraisal or coverage determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownScheduledPropertyValueMinor",
      label: "Known scheduled property value minor",
      kind: "number",
    },
    {
      id: "knownUnscheduledPropertyValueMinor",
      label: "Known unscheduled property value minor",
      kind: "number",
    },
    {
      id: "scheduledItemsWithoutValueEvidence",
      label: "Scheduled items without value evidence",
      kind: "stringList",
    },
    {
      id: "knownScheduleLimitDeficitItemIds",
      label: "Known schedule limit deficit item ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedItemIds: value.observedItemIds as readonly string[],
      callerItemReplacementMinor:
        value.callerItemReplacementMinor as readonly number[],
      callerScheduledItemFlags:
        value.callerScheduledItemFlags as readonly number[],
      itemValuationEvidenceFlags:
        value.itemValuationEvidenceFlags as readonly number[],
      callerVerifiedScheduleLimitsMinor:
        value.callerVerifiedScheduleLimitsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
