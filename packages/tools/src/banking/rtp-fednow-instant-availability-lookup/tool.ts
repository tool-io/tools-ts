import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerInstantRailIds: readonly string[];
  readonly callerRailAmountLimitsMinor: readonly number[];
  readonly callerSenderEnabledFlags: readonly number[];
  readonly callerReceiverEnabledFlags: readonly number[];
  readonly callerServiceOperationalKnownFlags: readonly number[];
  readonly callerServiceOperationalFlags: readonly number[];
  readonly transactionMinor: number;
}>;
export type Output = Readonly<{
  readonly availableInstantRailIds: readonly string[];
  readonly unknownOperationalRailIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerInstantRailIds",
    label: "Caller instant rail ids",
    kind: "stringList",
  },
  {
    id: "callerRailAmountLimitsMinor",
    label: "Caller rail amount limits minor",
    kind: "numberList",
  },
  {
    id: "callerSenderEnabledFlags",
    label: "Caller sender enabled flags",
    kind: "numberList",
  },
  {
    id: "callerReceiverEnabledFlags",
    label: "Caller receiver enabled flags",
    kind: "numberList",
  },
  {
    id: "callerServiceOperationalKnownFlags",
    label: "Caller service operational known flags",
    kind: "numberList",
  },
  {
    id: "callerServiceOperationalFlags",
    label: "Caller service operational flags",
    kind: "numberList",
  },
  { id: "transactionMinor", label: "Transaction minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.transactionMinor);
  unique(input.callerInstantRailIds, "rails");
  for (const v of [
    input.callerRailAmountLimitsMinor,
    input.callerSenderEnabledFlags,
    input.callerReceiverEnabledFlags,
    input.callerServiceOperationalKnownFlags,
    input.callerServiceOperationalFlags,
  ])
    aligned(input.callerInstantRailIds, v, "rails");
  input.callerRailAmountLimitsMinor.forEach((v) => money(v));
  for (const v of [
    input.callerSenderEnabledFlags,
    input.callerReceiverEnabledFlags,
    input.callerServiceOperationalKnownFlags,
    input.callerServiceOperationalFlags,
  ])
    binary(v, "flags");
  const eligible = input.callerInstantRailIds.map(
    (_, i) =>
      input.transactionMinor <= input.callerRailAmountLimitsMinor[i] &&
      input.callerSenderEnabledFlags[i] &&
      input.callerReceiverEnabledFlags[i],
  );
  return {
    availableInstantRailIds: input.callerInstantRailIds.filter(
      (_, i) =>
        eligible[i] &&
        input.callerServiceOperationalKnownFlags[i] &&
        input.callerServiceOperationalFlags[i],
    ),
    unknownOperationalRailIds: input.callerInstantRailIds.filter(
      (_, i) => eligible[i] && !input.callerServiceOperationalKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerInstantRailIds: ["rtp", "fednow"],
  callerRailAmountLimitsMinor: [1000, 2000],
  callerSenderEnabledFlags: [1, 1],
  callerReceiverEnabledFlags: [0, 1],
  callerServiceOperationalKnownFlags: [1, 0],
  callerServiceOperationalFlags: [1, 1],
  transactionMinor: 500,
} satisfies Input;
export const exampleOutput = {
  availableInstantRailIds: [],
  unknownOperationalRailIds: ["fednow"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/rtp-fednow-instant-availability-lookup",
  title: "RTP FedNow Instant Availability Lookup",
  description:
    "Screen RTP/FedNow availability against independently verified endpoints, amount limits and current operational evidence;24/7 label alone never establishes availability. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableInstantRailIds",
      label: "Available instant rail ids",
      kind: "stringList",
    },
    {
      id: "unknownOperationalRailIds",
      label: "Unknown operational rail ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerInstantRailIds: value.callerInstantRailIds as readonly string[],
      callerRailAmountLimitsMinor:
        value.callerRailAmountLimitsMinor as readonly number[],
      callerSenderEnabledFlags:
        value.callerSenderEnabledFlags as readonly number[],
      callerReceiverEnabledFlags:
        value.callerReceiverEnabledFlags as readonly number[],
      callerServiceOperationalKnownFlags:
        value.callerServiceOperationalKnownFlags as readonly number[],
      callerServiceOperationalFlags:
        value.callerServiceOperationalFlags as readonly number[],
      transactionMinor: value.transactionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
