import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontSampleId: string;
  readonly backupSampleId: string;
  readonly samplingRunId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    backupSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    samplingRunId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["frontSampleId", "backupSampleId", "samplingRunId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicitly supplied front and backup air-sampling sections without determining breakthrough thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontSampleId, backupSampleId, samplingRunId } = request;
  const compute = (): Output => {
    H.domain(frontSampleId.length > 0, "frontSampleId");
    H.domain(backupSampleId.length > 0, "backupSampleId");
    H.domain(samplingRunId.length > 0, "samplingRunId");
    return {
      token: JSON.stringify([frontSampleId, backupSampleId, samplingRunId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frontSampleId: "F17", backupSampleId: "B17", samplingRunId: "R4" },
  output: { token: '["F17","B17","R4"]' },
} satisfies ToolExample<Input, Output>;
export const airSamplingBreakthroughSamplePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/air-sampling-breakthrough-sample-pair",
    title: "Air Sampling Breakthrough Sample Pair",
    description:
      "Link explicitly supplied front and backup air-sampling sections without determining breakthrough thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        backupSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        samplingRunId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["frontSampleId", "backupSampleId", "samplingRunId"],
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
          id: "frontSampleId",
          label: "Front Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "backupSampleId",
          label: "Backup Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "samplingRunId",
          label: "Sampling Run Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = airSamplingBreakthroughSamplePairTool.execute;
export default airSamplingBreakthroughSamplePairTool;
