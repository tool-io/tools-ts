import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  unique,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerFloaterScheduledItemIds: readonly string[];
  readonly callerScheduledItemLimitsMinor: readonly number[];
  readonly observedLossItemIds: readonly string[];
  readonly callerIndependentlyCoveredItemLossMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerScheduledItemLossPaymentsMinor: readonly number[];
  readonly observedUnscheduledLossItemIds: readonly string[];
  readonly scheduledItemLossAboveLimitMinor: number;
}>;
const inputFields = [
  {
    id: "callerFloaterScheduledItemIds",
    label: "Caller floater scheduled item ids",
    kind: "stringList",
  },
  {
    id: "callerScheduledItemLimitsMinor",
    label: "Caller scheduled item limits minor",
    kind: "numberList",
  },
  {
    id: "observedLossItemIds",
    label: "Observed loss item ids",
    kind: "stringList",
  },
  {
    id: "callerIndependentlyCoveredItemLossMinor",
    label: "Caller independently covered item loss minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerFloaterScheduledItemIds, "schedule");
  aligned(
    input.callerFloaterScheduledItemIds,
    input.callerScheduledItemLimitsMinor,
    "schedule",
  );
  unique(input.observedLossItemIds, "lossItems");
  aligned(
    input.observedLossItemIds,
    input.callerIndependentlyCoveredItemLossMinor,
    "losses",
  );
  [
    ...input.callerScheduledItemLimitsMinor,
    ...input.callerIndependentlyCoveredItemLossMinor,
  ].forEach((v) => money(v));
  let excess = 0;
  const payments = input.observedLossItemIds.map((v, i) => {
    const j = input.callerFloaterScheduledItemIds.indexOf(v);
    if (j < 0) return 0;
    const pay = Math.min(
      input.callerScheduledItemLimitsMinor[j],
      input.callerIndependentlyCoveredItemLossMinor[i],
    );
    excess += input.callerIndependentlyCoveredItemLossMinor[i] - pay;
    return pay;
  });
  return {
    callerScheduledItemLossPaymentsMinor: payments,
    observedUnscheduledLossItemIds: input.observedLossItemIds.filter(
      (v) => !input.callerFloaterScheduledItemIds.includes(v),
    ),
    scheduledItemLossAboveLimitMinor: integer(excess, "excess"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFloaterScheduledItemIds: ["camera", "instrument"],
  callerScheduledItemLimitsMinor: [5000, 10000],
  observedLossItemIds: ["camera", "unlisted"],
  callerIndependentlyCoveredItemLossMinor: [6000, 2000],
} satisfies Input;
export const exampleOutput = {
  callerScheduledItemLossPaymentsMinor: [5000, 0],
  observedUnscheduledLossItemIds: ["unlisted"],
  scheduledItemLossAboveLimitMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/inland-marine-scheduled-floaters-lookup",
  title: "Inland Marine Scheduled Floaters Lookup",
  description:
    "Match actual loss item IDs to verified inland-marine schedule with caller independently covered losses and item caps; unlisted items explicit, no inferred blanket cover or custody/transit eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScheduledItemLossPaymentsMinor",
      label: "Caller scheduled item loss payments minor",
      kind: "numberList",
    },
    {
      id: "observedUnscheduledLossItemIds",
      label: "Observed unscheduled loss item ids",
      kind: "stringList",
    },
    {
      id: "scheduledItemLossAboveLimitMinor",
      label: "Scheduled item loss above limit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFloaterScheduledItemIds:
        value.callerFloaterScheduledItemIds as readonly string[],
      callerScheduledItemLimitsMinor:
        value.callerScheduledItemLimitsMinor as readonly number[],
      observedLossItemIds: value.observedLossItemIds as readonly string[],
      callerIndependentlyCoveredItemLossMinor:
        value.callerIndependentlyCoveredItemLossMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
