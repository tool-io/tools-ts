import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly sourcePressure: number;
  readonly targetPressure: number;
  readonly sourceKelvin: number;
  readonly targetKelvin: number;
  readonly sourceVaporPressure: number;
  readonly targetVaporPressure: number;
};
export type Output = { readonly convertedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    sourcePressure: { type: "number" },
    targetPressure: { type: "number" },
    sourceKelvin: { type: "number", exclusiveMinimum: 0 },
    targetKelvin: { type: "number", exclusiveMinimum: 0 },
    sourceVaporPressure: { type: "number", minimum: 0 },
    targetVaporPressure: { type: "number", minimum: 0 },
  },
  required: [
    "volume",
    "sourcePressure",
    "targetPressure",
    "sourceKelvin",
    "targetKelvin",
    "sourceVaporPressure",
    "targetVaporPressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedVolume: { type: "number" } },
  required: ["convertedVolume"],
} as const;
/** Ideal dry-gas-equivalent volume conversion using entirely supplied temperature, total pressure and vapor pressure states. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    volume,
    sourcePressure,
    targetPressure,
    sourceKelvin,
    targetKelvin,
    sourceVaporPressure,
    targetVaporPressure,
  } = request;
  const compute = (): Output => {
    H.domain(
      volume >= 0 &&
        sourceVaporPressure >= 0 &&
        targetVaporPressure >= 0 &&
        sourcePressure > sourceVaporPressure &&
        targetPressure > targetVaporPressure,
    );
    H.positive(sourceKelvin);
    H.positive(targetKelvin);
    return {
      convertedVolume:
        (((volume * (sourcePressure - sourceVaporPressure)) /
          (targetPressure - targetVaporPressure)) *
          targetKelvin) /
        sourceKelvin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volume: 2,
    sourcePressure: 100,
    targetPressure: 100,
    sourceKelvin: 300,
    targetKelvin: 300,
    sourceVaporPressure: 0,
    targetVaporPressure: 0,
  },
  output: { convertedVolume: 2 },
} satisfies ToolExample<Input, Output>;
export const lungVolumeStandardStateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/lung-volume-standard-state-token",
    title: "Lung Volume Standard State Token Tool",
    description:
      "Ideal dry-gas-equivalent volume conversion using entirely supplied temperature, total pressure and vapor pressure states.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        sourcePressure: { type: "number" },
        targetPressure: { type: "number" },
        sourceKelvin: { type: "number", exclusiveMinimum: 0 },
        targetKelvin: { type: "number", exclusiveMinimum: 0 },
        sourceVaporPressure: { type: "number", minimum: 0 },
        targetVaporPressure: { type: "number", minimum: 0 },
      },
      required: [
        "volume",
        "sourcePressure",
        "targetPressure",
        "sourceKelvin",
        "targetKelvin",
        "sourceVaporPressure",
        "targetVaporPressure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedVolume: { type: "number" } },
      required: ["convertedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourcePressure",
          label: "Source Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPressure",
          label: "Target Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceKelvin",
          label: "Source Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetKelvin",
          label: "Target Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceVaporPressure",
          label: "Source Vapor Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetVaporPressure",
          label: "Target Vapor Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedVolume",
          label: "Converted Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lungVolumeStandardStateTokenTool.execute;
export default lungVolumeStandardStateTokenTool;
