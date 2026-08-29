import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SampleAndHoldDroopRateInput = Readonly<{
  readonly leakageCurrentAmperes: number;
  readonly holdCapacitanceFarads: number;
}>;
export type SampleAndHoldDroopRateOutput = Readonly<{
  droopVoltsPerSecond: number;
}>;

export const calculateSampleAndHoldDroopRate = (
  i: SampleAndHoldDroopRateInput,
): SampleAndHoldDroopRateOutput => {
  const value = i.leakageCurrentAmperes / i.holdCapacitanceFarads;
  if (!Number.isFinite(value))
    simpleError(
      "droopVoltsPerSecond",
      "The inputs produce a non-finite result.",
    );
  return { droopVoltsPerSecond: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { leakageCurrentAmperes: 1e-9, holdCapacitanceFarads: 1e-8 },
  output: { droopVoltsPerSecond: 0.1 },
} satisfies ToolExample<
  SampleAndHoldDroopRateInput,
  SampleAndHoldDroopRateOutput
>;

export const tool = createSimpleTool({
  id: "electronics/sample-and-hold-droop-rate",
  title: "Sample And Hold Droop Rate",
  description:
    "Calculate the magnitude of sample-and-hold voltage droop per second from leakage current divided by hold capacitance.",
  inputs: [
    {
      id: "leakageCurrentAmperes",
      kind: "number",
      label: "Leakage Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "holdCapacitanceFarads",
      kind: "number",
      label: "Hold Capacitance (F)",
      unit: "F",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "droopVoltsPerSecond",
      kind: "number",
      label: "Droop (V/s)",
      unit: "V/s",
    },
  ],
  calculate: (input) =>
    calculateSampleAndHoldDroopRate({
      leakageCurrentAmperes: input.leakageCurrentAmperes as number,
      holdCapacitanceFarads: input.holdCapacitanceFarads as number,
    }),
});
export const sampleAndHoldDroopRateTool = tool;
export const runSampleAndHoldDroopRate = tool.execute;
export default tool;
