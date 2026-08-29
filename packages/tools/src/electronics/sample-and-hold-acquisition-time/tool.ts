import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SampleAndHoldAcquisitionTimeInput = Readonly<{
  readonly sourceResistanceOhms: number;
  readonly switchResistanceOhms: number;
  readonly holdCapacitanceFarads: number;
  readonly remainingErrorFraction: number;
}>;
export type SampleAndHoldAcquisitionTimeOutput = Readonly<{
  acquisitionSeconds: number;
}>;

export const calculateSampleAndHoldAcquisitionTime = (
  i: SampleAndHoldAcquisitionTimeInput,
): SampleAndHoldAcquisitionTimeOutput => {
  if (i.remainingErrorFraction === 0)
    simpleError(
      "remainingErrorFraction",
      "The remaining error fraction must be greater than zero.",
    );
  const value =
    -(i.sourceResistanceOhms + i.switchResistanceOhms) *
    i.holdCapacitanceFarads *
    Math.log(i.remainingErrorFraction);
  if (!Number.isFinite(value))
    simpleError(
      "acquisitionSeconds",
      "The inputs produce a non-finite result.",
    );
  return { acquisitionSeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    sourceResistanceOhms: 1000,
    switchResistanceOhms: 100,
    holdCapacitanceFarads: 1e-9,
    remainingErrorFraction: 0.001,
  },
  output: { acquisitionSeconds: 0.0000075985308068803505 },
} satisfies ToolExample<
  SampleAndHoldAcquisitionTimeInput,
  SampleAndHoldAcquisitionTimeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/sample-and-hold-acquisition-time",
  title: "Sample And Hold Acquisition Time",
  description:
    "Estimate sample-and-hold acquisition time for first-order RC settling to a specified remaining error fraction after a voltage step.",
  inputs: [
    {
      id: "sourceResistanceOhms",
      kind: "number",
      label: "Source Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "switchResistanceOhms",
      kind: "number",
      label: "Switch Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "holdCapacitanceFarads",
      kind: "number",
      label: "Hold Capacitance (F)",
      unit: "F",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "remainingErrorFraction",
      kind: "number",
      label: "Remaining Error Fraction",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "acquisitionSeconds",
      kind: "number",
      label: "Acquisition (s)",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateSampleAndHoldAcquisitionTime({
      sourceResistanceOhms: input.sourceResistanceOhms as number,
      switchResistanceOhms: input.switchResistanceOhms as number,
      holdCapacitanceFarads: input.holdCapacitanceFarads as number,
      remainingErrorFraction: input.remainingErrorFraction as number,
    }),
});
export const sampleAndHoldAcquisitionTimeTool = tool;
export const runSampleAndHoldAcquisitionTime = tool.execute;
export default tool;
