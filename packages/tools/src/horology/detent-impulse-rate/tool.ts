import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetentImpulseInput = {
  readonly balanceBeatsPerHour: number;
};

export type DetentImpulseOutput = {
  readonly beatsPerImpulse: 2;
  readonly impulsesPerHour: number;
  readonly impulsesPerFullOscillation: 1;
};

export const calculateDetentImpulseRate = (
  input: DetentImpulseInput,
): DetentImpulseOutput => {
  if (
    !Number.isSafeInteger(input.balanceBeatsPerHour) ||
    input.balanceBeatsPerHour < 2 ||
    input.balanceBeatsPerHour % 2 !== 0
  )
    simpleError(
      "balanceBeatsPerHour",
      "Balance beats per hour must be a positive even integer.",
      "balance_beat_rate_invalid",
    );
  return {
    beatsPerImpulse: 2,
    impulsesPerHour: input.balanceBeatsPerHour / 2,
    impulsesPerFullOscillation: 1,
  };
};

export const detentImpulseExample = {
  input: { balanceBeatsPerHour: 18_000 },
  output: {
    beatsPerImpulse: 2,
    impulsesPerHour: 9000,
    impulsesPerFullOscillation: 1,
  },
} satisfies ToolExample<DetentImpulseInput, DetentImpulseOutput>;

export const detentImpulseTool = createSimpleTool({
  calculate: (input) =>
    calculateDetentImpulseRate({
      balanceBeatsPerHour: input.balanceBeatsPerHour as number,
    }),
  description:
    "Calculate the single-impulse rate of a detent escapement, which delivers one impulse per full two-beat balance oscillation.",
  id: "horology/detent-impulse-rate",
  inputs: [
    {
      id: "balanceBeatsPerHour",
      kind: "integer",
      label: "Balance beats per hour",
      minimum: 2,
    },
  ],
  outputs: [
    {
      id: "beatsPerImpulse",
      kind: "integer",
      label: "Beats per impulse",
      maximum: 2,
      minimum: 2,
    },
    {
      id: "impulsesPerHour",
      kind: "number",
      label: "Impulses per hour",
      minimum: 1,
    },
    {
      id: "impulsesPerFullOscillation",
      kind: "integer",
      label: "Impulses per full oscillation",
      maximum: 1,
      minimum: 1,
    },
  ],
  title: "Detent Escapement Impulse Rate",
});

export const runDetentImpulse = detentImpulseTool.execute;
export default detentImpulseTool;
