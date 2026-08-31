import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerSendSlotLabels: readonly string[];
  readonly observedDeliveredBySlot: readonly number[];
  readonly observedHumanUniqueOpensBySlot: readonly number[];
  readonly callerMinimumDeliveredEvidence: number;
}>;
export type Output = Readonly<{
  readonly observedSlotOpenRatePercents: readonly number[];
  readonly eligibleEvidenceSlotFlags: readonly number[];
  readonly highestObservedEligibleSlotLabel: string;
  readonly eligibleSlotEvidenceAvailable: boolean;
}>;
const inputFields = [
  {
    id: "callerSendSlotLabels",
    label: "Caller send slot labels",
    kind: "stringList",
  },
  {
    id: "observedDeliveredBySlot",
    label: "Observed delivered by slot",
    kind: "numberList",
  },
  {
    id: "observedHumanUniqueOpensBySlot",
    label: "Observed human unique opens by slot",
    kind: "numberList",
  },
  {
    id: "callerMinimumDeliveredEvidence",
    label: "Caller minimum delivered evidence",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSendSlotLabels,
    input.observedDeliveredBySlot,
    "callerSendSlotLabels",
  );
  aligned(
    input.callerSendSlotLabels,
    input.observedHumanUniqueOpensBySlot,
    "callerSendSlotLabels",
  );
  unique(input.callerSendSlotLabels, "slots");
  bounded(input.callerMinimumDeliveredEvidence, "minimum", 1, 1000000000);
  input.observedDeliveredBySlot.forEach((v, i) => {
    bounded(v, "delivered", 1, 1000000000);
    bounded(input.observedHumanUniqueOpensBySlot[i], "opens", 0, v);
  });
  const rates = input.observedDeliveredBySlot.map(
      (v, i) => (100 * input.observedHumanUniqueOpensBySlot[i]) / v,
    ),
    flags = input.observedDeliveredBySlot.map((v) =>
      v >= input.callerMinimumDeliveredEvidence ? 1 : 0,
    );
  let best = -1;
  rates.forEach((v, i) => {
    if (flags[i] && (best < 0 || v > rates[best])) best = i;
  });
  return {
    observedSlotOpenRatePercents: rates,
    eligibleEvidenceSlotFlags: flags,
    highestObservedEligibleSlotLabel:
      best < 0 ? "" : input.callerSendSlotLabels[best],
    eligibleSlotEvidenceAvailable: best >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSendSlotLabels: ["morning", "evening"],
  observedDeliveredBySlot: [100, 10],
  observedHumanUniqueOpensBySlot: [20, 5],
  callerMinimumDeliveredEvidence: 50,
} satisfies Input;
export const exampleOutput = {
  observedSlotOpenRatePercents: [20, 50],
  eligibleEvidenceSlotFlags: [1, 0],
  highestObservedEligibleSlotLabel: "morning",
  eligibleSlotEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/newsletter-send-time-open-rate-optimum-lookup",
  title: "Newsletter Send Time Open Rate Optimum Lookup",
  description:
    "Compare actual human-open/send-slot cohorts with caller minimum delivered evidence and stable best observed rate; machine opens must already be removed, no causal optimum send time, confidence-adjusted experimental winner or future open prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSlotOpenRatePercents",
      label: "Observed slot open rate percents",
      kind: "numberList",
    },
    {
      id: "eligibleEvidenceSlotFlags",
      label: "Eligible evidence slot flags",
      kind: "numberList",
    },
    {
      id: "highestObservedEligibleSlotLabel",
      label: "Highest observed eligible slot label",
      kind: "string",
    },
    {
      id: "eligibleSlotEvidenceAvailable",
      label: "Eligible slot evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSendSlotLabels: value.callerSendSlotLabels as readonly string[],
      observedDeliveredBySlot:
        value.observedDeliveredBySlot as readonly number[],
      observedHumanUniqueOpensBySlot:
        value.observedHumanUniqueOpensBySlot as readonly number[],
      callerMinimumDeliveredEvidence:
        value.callerMinimumDeliveredEvidence as number,
    }),
});
export const run = tool.execute;
export default tool;
