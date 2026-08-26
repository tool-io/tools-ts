import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JibAreaInput = {
  readonly iMeasurementMeters: number;
  readonly jMeasurementMeters: number;
};

export type JibAreaOutput = {
  readonly jibAreaM2: number;
};

export const calculateJibArea = (
  iMeasurementMeters: number,
  jMeasurementMeters: number,
): number | null =>
  iMeasurementMeters > 0 && jMeasurementMeters > 0
    ? (iMeasurementMeters * jMeasurementMeters) / 2
    : null;

export const jibAreaExample = {
  input: { iMeasurementMeters: 10, jMeasurementMeters: 6 },
  output: { jibAreaM2: 30 },
} satisfies ToolExample<JibAreaInput, JibAreaOutput>;

export const jibAreaTool = createSimpleTool({
  id: "sailing/sail-area-jib",
  title: "Jib Area Calculator",
  description:
    "Calculate the triangular jib area from the I and J mast and deck measurements.",
  inputs: [
    {
      id: "iMeasurementMeters",
      kind: "number",
      label: "I measurement",
      unit: "m",
    },
    {
      id: "jMeasurementMeters",
      kind: "number",
      label: "J measurement",
      unit: "m",
    },
  ],
  outputs: [
    {
      format: "area-m2",
      id: "jibAreaM2",
      kind: "number",
      label: "Jib area",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const i = input.iMeasurementMeters as number;
    const j = input.jMeasurementMeters as number;
    const jibAreaM2 = calculateJibArea(i, j);
    if (jibAreaM2 === null)
      simpleError(
        i <= 0 ? "iMeasurementMeters" : "jMeasurementMeters",
        "Enter positive I and J measurements.",
        "invalid_dimensions",
      );
    return { jibAreaM2 };
  },
});

export const runJibArea = jibAreaTool.execute;
export default jibAreaTool;
