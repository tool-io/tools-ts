import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaristorEnergyRatingInput = Readonly<{
  readonly clampingVoltageV: number;
  readonly pulseCurrentA: number;
  readonly pulseDurationS: number;
}>;
export type VaristorEnergyRatingOutput = Readonly<{
  readonly minimumPulseEnergyJ: number;
}>;

export const calculateVaristorEnergyRating = (
  x: VaristorEnergyRatingInput,
): VaristorEnergyRatingOutput => {
  if (!Number.isFinite(x.clampingVoltageV) || x.clampingVoltageV < 0)
    simpleError("clampingVoltageV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pulseCurrentA) || x.pulseCurrentA < 0)
    simpleError("pulseCurrentA", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pulseDurationS) || x.pulseDurationS < 0)
    simpleError("pulseDurationS", "Provide a finite number at least 0.");
  const minimumPulseEnergyJ =
    x.clampingVoltageV * x.pulseCurrentA * x.pulseDurationS;
  if (!Number.isFinite(minimumPulseEnergyJ))
    simpleError("minimumPulseEnergyJ", "The inputs produce an invalid result.");
  return {
    minimumPulseEnergyJ: Object.is(minimumPulseEnergyJ, -0)
      ? 0
      : minimumPulseEnergyJ,
  };
};

export const example = {
  input: { clampingVoltageV: 100, pulseCurrentA: 10, pulseDurationS: 0.001 },
  output: { minimumPulseEnergyJ: 1 },
} satisfies ToolExample<VaristorEnergyRatingInput, VaristorEnergyRatingOutput>;

export const tool = createSimpleTool({
  id: "electronics/varistor-energy-rating",
  title: "Varistor Energy Rating",
  description:
    "Estimate minimum varistor pulse-energy rating from a rectangular clamping-voltage and pulse-current approximation; compare with the actual waveform and derating.",
  inputs: [
    {
      id: "clampingVoltageV",
      kind: "number",
      label: "Clamping voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "pulseCurrentA",
      kind: "number",
      label: "Pulse current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "pulseDurationS",
      kind: "number",
      label: "Pulse duration",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "minimumPulseEnergyJ",
      kind: "number",
      label: "Minimum pulse-energy rating",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculateVaristorEnergyRating({
      clampingVoltageV: input.clampingVoltageV as number,
      pulseCurrentA: input.pulseCurrentA as number,
      pulseDurationS: input.pulseDurationS as number,
    }),
});
export const varistorEnergyRatingTool = tool;
export const runVaristorEnergyRating = tool.execute;
export default tool;
