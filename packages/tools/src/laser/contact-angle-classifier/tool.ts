import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly contactAngleDegrees: number;
  readonly hydrophobicThresholdDegrees: number;
  readonly superhydrophobicThresholdDegrees: number;
}>;
export type Output = Readonly<{
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.hydrophobicThresholdDegrees > input.superhydrophobicThresholdDegrees
  )
    simpleError(
      "hydrophobicThresholdDegrees",
      "Hydrophobic threshold cannot exceed superhydrophobic threshold.",
      "invalid_thresholds",
    );
  return {
    classification:
      input.contactAngleDegrees >= input.superhydrophobicThresholdDegrees
        ? "superhydrophobic"
        : input.contactAngleDegrees >= input.hydrophobicThresholdDegrees
          ? "hydrophobic"
          : "hydrophilic",
  };
};

export const exampleInput = {
  contactAngleDegrees: 160,
  hydrophobicThresholdDegrees: 90,
  superhydrophobicThresholdDegrees: 150,
} satisfies Input;
export const exampleOutput = {
  classification: "superhydrophobic",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      contactAngleDegrees: input.contactAngleDegrees as number,
      hydrophobicThresholdDegrees: input.hydrophobicThresholdDegrees as number,
      superhydrophobicThresholdDegrees:
        input.superhydrophobicThresholdDegrees as number,
    }),
  description:
    "Classify a measured contact angle using caller-supplied wetting thresholds.",
  id: "laser/contact-angle-classifier",
  inputs: [
    {
      id: "contactAngleDegrees",
      label: "Measured contact angle",
      kind: "number",
      minimum: 0,
      maximum: 180,
      unit: "°",
    },
    {
      id: "hydrophobicThresholdDegrees",
      label: "Hydrophobic threshold",
      kind: "number",
      minimum: 0,
      maximum: 180,
      unit: "°",
    },
    {
      id: "superhydrophobicThresholdDegrees",
      label: "Superhydrophobic threshold",
      kind: "number",
      minimum: 0,
      maximum: 180,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "classification",
      label: "Wetting classification",
      kind: "string",
      enum: ["hydrophilic", "hydrophobic", "superhydrophobic"],
    },
  ],
  title: "Contact-Angle Classifier",
});

export const run = tool.execute;
export default tool;
