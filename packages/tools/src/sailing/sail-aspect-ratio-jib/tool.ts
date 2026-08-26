import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailAspectRatioJibInput = {
  readonly iMeasurementMeters: number;
  readonly jibAreaM2: number;
};

export type SailAspectRatioJibOutput = {
  readonly aspectRatio: number;
};

export const sailAspectRatioJibExample = {
  input: { iMeasurementMeters: 12, jibAreaM2: 48 },
  output: { aspectRatio: 3 },
} satisfies ToolExample<SailAspectRatioJibInput, SailAspectRatioJibOutput>;

export const sailAspectRatioJibTool = createSimpleTool({
  calculate: (input) => {
    const iMeasurementMeters = input.iMeasurementMeters as number;
    const jibAreaM2 = input.jibAreaM2 as number;
    if (iMeasurementMeters <= 0)
      simpleError(
        "iMeasurementMeters",
        "I measurement must be positive.",
        "invalid_i_measurement",
      );
    if (jibAreaM2 <= 0)
      simpleError("jibAreaM2", "Jib area must be positive.", "invalid_area");
    return {
      aspectRatio: (iMeasurementMeters * iMeasurementMeters) / jibAreaM2,
    };
  },
  description:
    "Compute the jib aspect ratio as aspectRatio = iMeasurementMeters^2 / jibAreaM2 using the forestay height I and the measured jib area.",
  id: "sailing/sail-aspect-ratio-jib",
  inputs: [
    {
      description: "Height of the foretriangle on the forestay.",
      id: "iMeasurementMeters",
      kind: "number",
      label: "I measurement",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Measured area of the jib.",
      id: "jibAreaM2",
      kind: "number",
      label: "Jib area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description: "Aspect ratio of the jib planform.",
      format: "ratio",
      id: "aspectRatio",
      kind: "number",
      label: "Aspect ratio",
    },
  ],
  title: "Jib Aspect Ratio",
});
export const runSailAspectRatioJib = sailAspectRatioJibTool.execute;
export default sailAspectRatioJibTool;
