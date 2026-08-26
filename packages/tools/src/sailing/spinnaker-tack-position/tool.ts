import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpinnakerTackPositionInput = {
  readonly luffLengthMeters: number;
  readonly luffPercentage?: number;
};

export type SpinnakerTackPositionOutput = {
  readonly tackHeightCm: number;
};

const DEFAULT_LUFF_PERCENTAGE = 95;

export const spinnakerTackPositionExample = {
  input: { luffLengthMeters: 10 },
  output: { tackHeightCm: 50 },
} satisfies ToolExample<
  SpinnakerTackPositionInput,
  SpinnakerTackPositionOutput
>;

export const calculateSpinnakerTackPosition = (
  input: SpinnakerTackPositionInput,
): SpinnakerTackPositionOutput => {
  if (input.luffLengthMeters <= 0)
    simpleError(
      "luffLengthMeters",
      "The luff length must be positive.",
      "invalid_input",
    );
  const luffPercentage = input.luffPercentage ?? DEFAULT_LUFF_PERCENTAGE;
  return {
    tackHeightCm: Math.round(
      (1 - luffPercentage / 100) * input.luffLengthMeters * 100,
    ),
  };
};

export const spinnakerTackPositionTool = createSimpleTool({
  calculate: (input) =>
    calculateSpinnakerTackPosition(
      input as unknown as SpinnakerTackPositionInput,
    ),
  description:
    "Estimate how high the spinnaker tack can be raised below a fixed full-hoist head position from the unused fraction of the luff length.",
  id: "sailing/spinnaker-tack-position",
  inputs: [
    {
      description: "Luff length of the spinnaker from tack to head.",
      format: "length-m",
      id: "luffLengthMeters",
      kind: "number",
      label: "Luff length",
      unit: "m",
    },
    {
      default: DEFAULT_LUFF_PERCENTAGE,
      description:
        "Fraction of the luff extended between the raised tack and the fixed full-hoist head; ninety five percent leaves five percent available as tack lift.",
      id: "luffPercentage",
      kind: "number",
      label: "Luff percentage",
      maximum: 100,
      minimum: 50,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Estimated tack lift above the full-luff tack position, rounded to centimeters.",
      format: "length-cm",
      id: "tackHeightCm",
      kind: "number",
      label: "Tack height",
      unit: "cm",
    },
  ],
  title: "Spinnaker Tack Height",
});
export const runSpinnakerTackPosition = spinnakerTackPositionTool.execute;
export default spinnakerTackPositionTool;
