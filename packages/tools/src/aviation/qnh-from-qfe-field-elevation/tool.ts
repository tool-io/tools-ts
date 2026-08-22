import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type QnhFromQfeFieldElevationInput = {
  readonly elevationMeters: number;
  readonly qfeHpa: number;
};

export type QnhFromQfeFieldElevationOutput = {
  readonly qnhHpa: number;
};

const METERS_PER_HECTOPASCAL = 8.23;

export const qnhFromQfeFieldElevationExample = {
  input: { elevationMeters: 100, qfeHpa: 1013.25 },
  output: { qnhHpa: 1025.4006682867557 },
} satisfies ToolExample<
  QnhFromQfeFieldElevationInput,
  QnhFromQfeFieldElevationOutput
>;

export const calculateQnhFromQfeFieldElevation = (
  input: QnhFromQfeFieldElevationInput,
): QnhFromQfeFieldElevationOutput => ({
  qnhHpa: input.qfeHpa + input.elevationMeters / METERS_PER_HECTOPASCAL,
});

export const qnhFromQfeFieldElevationTool = createSimpleTool({
  calculate: (input) =>
    calculateQnhFromQfeFieldElevation(
      input as unknown as QnhFromQfeFieldElevationInput,
    ),
  description:
    "Approximate QNH from QFE by adding the field elevation pressure at roughly 8.23 meters per hectopascal.",
  id: "aviation/qnh-from-qfe-field-elevation",
  inputs: [
    {
      description: "Field elevation above sea level.",
      id: "elevationMeters",
      kind: "number",
      label: "Field elevation",
      maximum: 9000,
      minimum: -500,
      unit: "m",
    },
    {
      description: "Station pressure adjusted to sea level of the field.",
      id: "qfeHpa",
      kind: "number",
      label: "QFE",
      maximum: 1100,
      minimum: 300,
      unit: "hPa",
    },
  ],
  outputs: [
    {
      description: "Sea-level pressure setting for the field.",
      format: "pressure",
      id: "qnhHpa",
      kind: "number",
      label: "QNH",
      unit: "hPa",
    },
  ],
  title: "QNH from QFE Field Elevation Calculator",
});
export const runQnhFromQfeFieldElevation = qnhFromQfeFieldElevationTool.execute;
export default qnhFromQfeFieldElevationTool;
