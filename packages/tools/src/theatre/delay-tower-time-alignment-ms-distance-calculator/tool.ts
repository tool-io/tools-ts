import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly mainSpeakerPathDistancesM: readonly number[];
  readonly delaySpeakerPathDistancesM: readonly number[];
  readonly speedOfSoundMSecond: number;
  readonly mainElectronicLatencyMs: number;
  readonly delayElectronicLatencyMs: number;
}>;
export type Output = Readonly<{
  readonly requiredAdditionalDelayMsBySeat: readonly number[];
  readonly delaySignRequiresAdvancingSourceFlags: readonly number[];
  readonly seatDelaySpreadMs: number;
}>;
const inputFields = [
  {
    id: "mainSpeakerPathDistancesM",
    label: "Main speaker path distances m",
    kind: "numberList",
  },
  {
    id: "delaySpeakerPathDistancesM",
    label: "Delay speaker path distances m",
    kind: "numberList",
  },
  {
    id: "speedOfSoundMSecond",
    label: "Speed of sound m second",
    kind: "number",
  },
  {
    id: "mainElectronicLatencyMs",
    label: "Main electronic latency ms",
    kind: "number",
  },
  {
    id: "delayElectronicLatencyMs",
    label: "Delay electronic latency ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.speedOfSoundMSecond, "speedOfSoundMSecond");
  input.mainSpeakerPathDistancesM.forEach((v) =>
    nonnegative(v, "mainSpeakerPathDistancesM"),
  );
  input.delaySpeakerPathDistancesM.forEach((v) =>
    nonnegative(v, "delaySpeakerPathDistancesM"),
  );
  nonnegative(input.mainElectronicLatencyMs, "mainElectronicLatencyMs");
  nonnegative(input.delayElectronicLatencyMs, "delayElectronicLatencyMs");
  aligned(
    input.mainSpeakerPathDistancesM,
    input.delaySpeakerPathDistancesM,
    "mainSpeakerPathDistancesM",
  );
  const offsets = input.mainSpeakerPathDistancesM.map(
    (v, i) =>
      ((v - input.delaySpeakerPathDistancesM[i]) / input.speedOfSoundMSecond) *
        1000 +
      input.mainElectronicLatencyMs -
      input.delayElectronicLatencyMs,
  );
  return {
    requiredAdditionalDelayMsBySeat: offsets,
    delaySignRequiresAdvancingSourceFlags: offsets.map((v) => (v < 0 ? 1 : 0)),
    seatDelaySpreadMs: Math.max(...offsets) - Math.min(...offsets),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  mainSpeakerPathDistancesM: [34, 68],
  delaySpeakerPathDistancesM: [0, 34],
  speedOfSoundMSecond: 340,
  mainElectronicLatencyMs: 1,
  delayElectronicLatencyMs: 2,
} satisfies Input;
export const exampleOutput = {
  requiredAdditionalDelayMsBySeat: [99, 99],
  delaySignRequiresAdvancingSourceFlags: [0, 0],
  seatDelaySpreadMs: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/delay-tower-time-alignment-ms-distance-calculator",
  title: "Delay Tower Time Alignment MS Distance Calculator",
  description:
    "Audit actual main/delay-speaker path and electronic arrival offsets across seats, retaining negative required offsets and multi-seat spread; not AV sync scalar, precedence recommendation or a venue-wide phase guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredAdditionalDelayMsBySeat",
      label: "Required additional delay ms by seat",
      kind: "numberList",
    },
    {
      id: "delaySignRequiresAdvancingSourceFlags",
      label: "Delay sign requires advancing source flags",
      kind: "numberList",
    },
    { id: "seatDelaySpreadMs", label: "Seat delay spread ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mainSpeakerPathDistancesM:
        value.mainSpeakerPathDistancesM as readonly number[],
      delaySpeakerPathDistancesM:
        value.delaySpeakerPathDistancesM as readonly number[],
      speedOfSoundMSecond: value.speedOfSoundMSecond as number,
      mainElectronicLatencyMs: value.mainElectronicLatencyMs as number,
      delayElectronicLatencyMs: value.delayElectronicLatencyMs as number,
    }),
});
export const run = tool.execute;
export default tool;
