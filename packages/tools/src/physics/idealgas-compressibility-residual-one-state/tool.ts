import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressure: number;
  readonly volume: number;
  readonly moles: number;
  readonly temperature: number;
  readonly gasConstant: number;
};
export type Output = {
  readonly compressibility: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressure: { type: "number", exclusiveMinimum: 0 },
    volume: { type: "number", exclusiveMinimum: 0 },
    moles: { type: "number", exclusiveMinimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressure", "volume", "moles", "temperature", "gasConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressibility: { type: "number" },
    residual: { type: "number" },
  },
  required: ["compressibility", "residual"],
} as const;
/** Return PV/(nRT) and its deviation from the ideal-gas value using caller-supplied consistent units and gas constant. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { pressure, volume, moles, temperature, gasConstant } = input;
  const compute = (): Output => {
    H.positive(pressure);
    H.positive(volume);
    H.positive(moles);
    H.positive(temperature);
    H.positive(gasConstant);
    const compressibility =
      (pressure * volume) / (moles * gasConstant * temperature);
    return { compressibility, residual: compressibility - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pressure: 2, volume: 3, moles: 1, temperature: 2, gasConstant: 3 },
  output: { compressibility: 1, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const idealgasCompressibilityResidualOneStateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/idealgas-compressibility-residual-one-state",
      title: "Idealgas Compressibility Residual One State Tool",
      description:
        "Return PV/(nRT) and its deviation from the ideal-gas value using caller-supplied consistent units and gas constant.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressure: { type: "number", exclusiveMinimum: 0 },
          volume: { type: "number", exclusiveMinimum: 0 },
          moles: { type: "number", exclusiveMinimum: 0 },
          temperature: { type: "number", exclusiveMinimum: 0 },
          gasConstant: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["pressure", "volume", "moles", "temperature", "gasConstant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compressibility: { type: "number" },
          residual: { type: "number" },
        },
        required: ["compressibility", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "pressure",
            label: "Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "moles",
            label: "Moles",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gasConstant",
            label: "Gas Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "compressibility",
            label: "Compressibility",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = idealgasCompressibilityResidualOneStateTool.execute;
export default idealgasCompressibilityResidualOneStateTool;
