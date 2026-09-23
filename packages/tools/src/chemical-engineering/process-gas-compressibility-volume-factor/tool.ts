import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moles: number;
  readonly compressibility: number;
  readonly gasConstant: number;
  readonly temperatureK: number;
  readonly pressure: number;
};
export type Output = {
  readonly idealVolume: number;
  readonly correctedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moles: { type: "number", minimum: 0 },
    compressibility: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    pressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "moles",
    "compressibility",
    "gasConstant",
    "temperatureK",
    "pressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealVolume: { type: "number" },
    correctedVolume: { type: "number" },
  },
  required: ["idealVolume", "correctedVolume"],
} as const;
/** Calculate process gas compressibility volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moles, compressibility, gasConstant, temperatureK, pressure } =
    request;
  const compute = (): Output => {
    H.domain(moles >= 0);
    H.positive(compressibility);
    H.positive(gasConstant);
    H.positive(temperatureK);
    H.positive(pressure);
    return {
      idealVolume: (moles * gasConstant * temperatureK) / pressure,
      correctedVolume:
        (compressibility * moles * gasConstant * temperatureK) / pressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moles: 2,
    compressibility: 0.9,
    gasConstant: 8,
    temperatureK: 300,
    pressure: 100000,
  },
  output: { idealVolume: 0.048, correctedVolume: 0.0432 },
} satisfies ToolExample<Input, Output>;
export const processGasCompressibilityVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/process-gas-compressibility-volume-factor",
      title: "Process Gas Compressibility Volume Factor Tool",
      description:
        "Calculate process gas compressibility volume factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moles: { type: "number", minimum: 0 },
          compressibility: { type: "number", exclusiveMinimum: 0 },
          gasConstant: { type: "number", exclusiveMinimum: 0 },
          temperatureK: { type: "number", exclusiveMinimum: 0 },
          pressure: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "moles",
          "compressibility",
          "gasConstant",
          "temperatureK",
          "pressure",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          idealVolume: { type: "number" },
          correctedVolume: { type: "number" },
        },
        required: ["idealVolume", "correctedVolume"],
      },
      ports: {
        inputs: [
          {
            id: "moles",
            label: "Moles",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "compressibility",
            label: "Compressibility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gasConstant",
            label: "Gas Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureK",
            label: "Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "pressure",
            label: "Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "idealVolume",
            label: "Ideal Volume",
            valueType: { type: "number" },
          },
          {
            id: "correctedVolume",
            label: "Corrected Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = processGasCompressibilityVolumeFactorTool.execute;
export default processGasCompressibilityVolumeFactorTool;
