import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly center: number; readonly width: number };
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "number" },
    width: { type: "number", minimum: 1 },
  },
  required: ["center", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Compute DICOM default LINEAR window thresholds c−0.5±(w−1)/2; not LINEAR_EXACT or SIGMOID. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { center, width } = request;
  const compute = (): Output => {
    H.domain(width >= 1);
    return {
      lower: center - 0.5 - (width - 1) / 2,
      upper: center - 0.5 + (width - 1) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { center: 50, width: 11 },
  output: { lower: 44.5, upper: 54.5 },
} satisfies ToolExample<Input, Output>;
export const dicomWindowLevelEndpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-window-level-endpoint",
    title: "DICOM Window Level Endpoint Tool",
    description:
      "Compute DICOM default LINEAR window thresholds c−0.5±(w−1)/2; not LINEAR_EXACT or SIGMOID.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        center: { type: "number" },
        width: { type: "number", minimum: 1 },
      },
      required: ["center", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dicomWindowLevelEndpointTool.execute;
export default dicomWindowLevelEndpointTool;
