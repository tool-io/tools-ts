import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detectionLimitMass: number;
  readonly sampledVolume: number;
};
export type Output = { readonly concentrationLimit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectionLimitMass: { type: "number", minimum: 0 },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["detectionLimitMass", "sampledVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { concentrationLimit: { type: "number" } },
  required: ["concentrationLimit"],
} as const;
/** Divide a supplied gas analyte mass detection limit by positive sampled gas volume on an explicitly consistent reference basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detectionLimitMass, sampledVolume } = request;
  const compute = (): Output => {
    H.domain(detectionLimitMass >= 0, "detectionLimitMass");
    (H.domain(
      Number.isFinite(sampledVolume) && sampledVolume > 0,
      "sampledVolume",
    ),
      sampledVolume);
    return { concentrationLimit: detectionLimitMass / sampledVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detectionLimitMass: 6, sampledVolume: 2 },
  output: { concentrationLimit: 3 },
} satisfies ToolExample<Input, Output>;
export const ambientGasDetectionLimitToVolumeTool = H.defineSchemaCalculation<
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
    id: "atmospheric-chemistry/ambient-gas-detection-limit-to-volume",
    title: "Ambient Gas Detection Limit To Volume",
    description:
      "Divide a supplied gas analyte mass detection limit by positive sampled gas volume on an explicitly consistent reference basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        detectionLimitMass: { type: "number", minimum: 0 },
        sampledVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["detectionLimitMass", "sampledVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { concentrationLimit: { type: "number" } },
      required: ["concentrationLimit"],
    },
    ports: {
      inputs: [
        {
          id: "detectionLimitMass",
          label: "Detection Limit Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "concentrationLimit",
          label: "Concentration Limit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambientGasDetectionLimitToVolumeTool.execute;
export default ambientGasDetectionLimitToVolumeTool;
