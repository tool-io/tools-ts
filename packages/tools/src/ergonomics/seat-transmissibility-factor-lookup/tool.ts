import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  squaredMean,
} from "../shared.js";
export type Input = Readonly<{
  readonly alreadyWeightedSeatAccelerations: readonly number[];
  readonly matchedWeightedFloorAccelerations: readonly number[];
  readonly representedSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly seatEffectiveAmplitudeTransmissibilityPercent: number;
  readonly seatWeightedRms: number;
  readonly floorWeightedRms: number;
}>;
const inputFields = [
  {
    id: "alreadyWeightedSeatAccelerations",
    label: "Already weighted seat accelerations",
    kind: "numberList",
  },
  {
    id: "matchedWeightedFloorAccelerations",
    label: "Matched weighted floor accelerations",
    kind: "numberList",
  },
  {
    id: "representedSeconds",
    label: "Represented seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedSeconds.forEach((v) => nonnegative(v, "representedSeconds"));
  aligned(
    input.alreadyWeightedSeatAccelerations,
    input.matchedWeightedFloorAccelerations,
    "alreadyWeightedSeatAccelerations",
  );
  aligned(
    input.alreadyWeightedSeatAccelerations,
    input.representedSeconds,
    "alreadyWeightedSeatAccelerations",
  );
  const seat = Math.sqrt(
      squaredMean(
        input.alreadyWeightedSeatAccelerations,
        input.representedSeconds,
      ),
    ),
    floor = Math.sqrt(
      positive(
        squaredMean(
          input.matchedWeightedFloorAccelerations,
          input.representedSeconds,
        ),
        "floorEnergy",
      ),
    );
  return {
    seatEffectiveAmplitudeTransmissibilityPercent: (100 * seat) / floor,
    seatWeightedRms: seat,
    floorWeightedRms: floor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alreadyWeightedSeatAccelerations: [1, 2],
  matchedWeightedFloorAccelerations: [2, 4],
  representedSeconds: [1, 3],
} satisfies Input;
export const exampleOutput = {
  seatEffectiveAmplitudeTransmissibilityPercent: 50,
  seatWeightedRms: 1.8027756377319946,
  floorWeightedRms: 3.605551275463989,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/seat-transmissibility-factor-lookup",
  title: "Seat Effective Amplitude Transmissibility Factor Lookup",
  description:
    "Compute observed SEAT weighted-RMS ratio from matched seat/base histories and actual time weights; caller must supply identical weighting conventions, no static seat rating or frequency-independent comfort guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "seatEffectiveAmplitudeTransmissibilityPercent",
      label: "Seat effective amplitude transmissibility percent",
      kind: "number",
    },
    { id: "seatWeightedRms", label: "Seat weighted rms", kind: "number" },
    { id: "floorWeightedRms", label: "Floor weighted rms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      alreadyWeightedSeatAccelerations:
        value.alreadyWeightedSeatAccelerations as readonly number[],
      matchedWeightedFloorAccelerations:
        value.matchedWeightedFloorAccelerations as readonly number[],
      representedSeconds: value.representedSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
