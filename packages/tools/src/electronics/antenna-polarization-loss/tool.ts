import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaPolarizationLossInput = Readonly<{
  readonly misalignmentDegrees: number;
}>;
export type AntennaPolarizationLossOutput = Readonly<{
  readonly lossDecibels: number;
}>;

export const calculateAntennaPolarizationLoss = (
  x: AntennaPolarizationLossInput,
): AntennaPolarizationLossOutput => {
  if (!Number.isFinite(x.misalignmentDegrees))
    simpleError("misalignmentDegrees", "Provide a finite number.");
  if (Math.abs(Math.cos((x.misalignmentDegrees * Math.PI) / 180)) < 1e-12)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const lossDecibels =
    -20 *
    Math.log10(Math.abs(Math.cos((x.misalignmentDegrees * Math.PI) / 180)));
  if (!Number.isFinite(lossDecibels))
    simpleError(
      "lossDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { lossDecibels: Object.is(lossDecibels, -0) ? 0 : lossDecibels };
};

export const example = {
  input: { misalignmentDegrees: 60 },
  output: { lossDecibels: 6.0205999132796215 },
} satisfies ToolExample<
  AntennaPolarizationLossInput,
  AntennaPolarizationLossOutput
>;

export const tool = createSimpleTool({
  id: "electronics/antenna-polarization-loss",
  title: "Antenna Polarization Loss",
  description:
    "Ideal linear-polarization mismatch loss from the relative angle between transmit and receive polarization axes.",
  inputs: [
    {
      id: "misalignmentDegrees",
      kind: "number",
      label: "Misalignment Degrees",
      unit: "°",
    },
  ],
  outputs: [
    { id: "lossDecibels", kind: "number", label: "Loss Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateAntennaPolarizationLoss({
      misalignmentDegrees: input.misalignmentDegrees as number,
    }),
});
export const antennaPolarizationLossTool = tool;
export const runAntennaPolarizationLoss = tool.execute;
export default tool;
