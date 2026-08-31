import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedChannelDischargesLiters: readonly number[];
  readonly collectionDurationsSeconds: readonly number[];
  readonly callerChannelMinimumLitersMinute: number;
}>;
export type Output = Readonly<{
  readonly observedChannelFlowsLitersMinute: readonly number[];
  readonly channelsBelowCallerFlowPolicy: readonly number[];
  readonly totalMeasuredChannelFlowLitersMinute: number;
}>;
const inputFields = [
  {
    id: "observedChannelDischargesLiters",
    label: "Observed channel discharges liters",
    kind: "numberList",
  },
  {
    id: "collectionDurationsSeconds",
    label: "Collection durations seconds",
    kind: "numberList",
  },
  {
    id: "callerChannelMinimumLitersMinute",
    label: "Caller channel minimum liters minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.collectionDurationsSeconds.forEach((v) =>
    positive(v, "collectionDurationsSeconds"),
  );
  input.observedChannelDischargesLiters.forEach((v) =>
    nonnegative(v, "observedChannelDischargesLiters"),
  );
  nonnegative(
    input.callerChannelMinimumLitersMinute,
    "callerChannelMinimumLitersMinute",
  );
  aligned(
    input.observedChannelDischargesLiters,
    input.collectionDurationsSeconds,
    "observedChannelDischargesLiters",
  );
  const flows = input.observedChannelDischargesLiters.map(
    (v, i) => (v / input.collectionDurationsSeconds[i]) * 60,
  );
  return {
    observedChannelFlowsLitersMinute: flows,
    channelsBelowCallerFlowPolicy: flows.flatMap((v, i) =>
      v < input.callerChannelMinimumLitersMinute ? [i] : [],
    ),
    totalMeasuredChannelFlowLitersMinute: sum(flows),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedChannelDischargesLiters: [2, 3],
  collectionDurationsSeconds: [60, 30],
  callerChannelMinimumLitersMinute: 2.5,
} satisfies Input;
export const exampleOutput = {
  observedChannelFlowsLitersMinute: [2, 6],
  channelsBelowCallerFlowPolicy: [0],
  totalMeasuredChannelFlowLitersMinute: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/nft-flow-rate-per-channel",
  title: "NFT Flow Rate Per Channel Calculator",
  description:
    "Audit actual NFT channel timed-discharge samples rather than assuming pump flow divided evenly; caller flow policy not universal nutrient delivery, disease or pump safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedChannelFlowsLitersMinute",
      label: "Observed channel flows liters minute",
      kind: "numberList",
    },
    {
      id: "channelsBelowCallerFlowPolicy",
      label: "Channels below caller flow policy",
      kind: "numberList",
    },
    {
      id: "totalMeasuredChannelFlowLitersMinute",
      label: "Total measured channel flow liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedChannelDischargesLiters:
        value.observedChannelDischargesLiters as readonly number[],
      collectionDurationsSeconds:
        value.collectionDurationsSeconds as readonly number[],
      callerChannelMinimumLitersMinute:
        value.callerChannelMinimumLitersMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
