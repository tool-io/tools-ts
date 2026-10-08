import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly depthText: string;
  readonly depthConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    depthText: { type: "string", maxLength: 8192, minLength: 1 },
    depthConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "depthText", "depthConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied borehole depth transcription and convention without trajectory conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, depthText, depthConvention } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(depthText.length > 0, "depthText");
    H.domain(depthConvention.length > 0, "depthConvention");
    return { token: JSON.stringify([sampleId, depthText, depthConvention]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    depthText: "120 m",
    depthConvention: "measured depth",
  },
  output: { token: '["S17","120 m","measured depth"]' },
} satisfies ToolExample<Input, Output>;
export const boreholeMeasuredTrueverticalDepthLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/borehole-measured-truevertical-depth-label",
      title: "Borehole Measured Truevertical Depth Label Tool",
      description:
        "Preserve an explicitly supplied borehole depth transcription and convention without trajectory conversion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleId: { type: "string", maxLength: 8192, minLength: 1 },
          depthText: { type: "string", maxLength: 8192, minLength: 1 },
          depthConvention: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sampleId", "depthText", "depthConvention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "sampleId",
            label: "Sample Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "depthText",
            label: "Depth Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "depthConvention",
            label: "Depth Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = boreholeMeasuredTrueverticalDepthLabelTool.execute;
export default boreholeMeasuredTrueverticalDepthLabelTool;
