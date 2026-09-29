import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceVolume: number;
  readonly referencePressure: number;
  readonly currentPressure: number;
  readonly temperatureRatio: number;
};
export type Output = {
  readonly volume: number;
  readonly compressionRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceVolume: { type: "number", minimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    currentPressure: { type: "number", exclusiveMinimum: 0 },
    temperatureRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "referenceVolume",
    "referencePressure",
    "currentPressure",
    "temperatureRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number" },
    compressionRatio: { type: "number" },
  },
  required: ["volume", "compressionRatio"],
} as const;
/** Closed ideal-gas bladder pressure/temperature scaling using absolute pressures; biological gas exchange is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referenceVolume,
    referencePressure,
    currentPressure,
    temperatureRatio,
  } = request;
  const compute = (): Output => {
    H.domain(referenceVolume >= 0);
    H.positive(referencePressure);
    H.positive(currentPressure);
    H.positive(temperatureRatio);
    return {
      volume:
        (referenceVolume * referencePressure * temperatureRatio) /
        currentPressure,
      compressionRatio:
        currentPressure / (referencePressure * temperatureRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceVolume: 10,
    referencePressure: 100,
    currentPressure: 200,
    temperatureRatio: 1,
  },
  output: { volume: 5, compressionRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const swimbladderVolumeDepthReferenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/swimbladder-volume-depth-reference-term",
      title: "Swimbladder Volume Depth Reference Term Tool",
      description:
        "Closed ideal-gas bladder pressure/temperature scaling using absolute pressures; biological gas exchange is excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceVolume: { type: "number", minimum: 0 },
          referencePressure: { type: "number", exclusiveMinimum: 0 },
          currentPressure: { type: "number", exclusiveMinimum: 0 },
          temperatureRatio: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "referenceVolume",
          "referencePressure",
          "currentPressure",
          "temperatureRatio",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volume: { type: "number" },
          compressionRatio: { type: "number" },
        },
        required: ["volume", "compressionRatio"],
      },
      ports: {
        inputs: [
          {
            id: "referenceVolume",
            label: "Reference Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referencePressure",
            label: "Reference Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentPressure",
            label: "Current Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureRatio",
            label: "Temperature Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "volume", label: "Volume", valueType: { type: "number" } },
          {
            id: "compressionRatio",
            label: "Compression Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = swimbladderVolumeDepthReferenceTermTool.execute;
export default swimbladderVolumeDepthReferenceTermTool;
