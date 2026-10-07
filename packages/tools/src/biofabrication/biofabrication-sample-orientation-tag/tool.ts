import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly axisWording: string;
  readonly orientationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    axisWording: { type: "string", maxLength: 8192, minLength: 1 },
    orientationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "axisWording", "orientationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit sample orientation label and source without inferring orientation from geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, axisWording, orientationSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(axisWording.length > 0, "axisWording");
    H.domain(orientationSource.length > 0, "orientationSource");
    return {
      token: JSON.stringify([sampleId, axisWording, orientationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    axisWording: "build axis",
    orientationSource: "Design A",
  },
  output: { token: '["S17","build axis","Design A"]' },
} satisfies ToolExample<Input, Output>;
export const biofabricationSampleOrientationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/biofabrication-sample-orientation-tag",
    title: "Biofabrication Sample Orientation Tag",
    description:
      "Preserve an explicit sample orientation label and source without inferring orientation from geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        axisWording: { type: "string", maxLength: 8192, minLength: 1 },
        orientationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "axisWording", "orientationSource"],
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
          id: "axisWording",
          label: "Axis Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "orientationSource",
          label: "Orientation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biofabricationSampleOrientationTagTool.execute;
export default biofabricationSampleOrientationTagTool;
