import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly potentialTemperature: number;
  readonly pressure: number;
  readonly exponent: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialTemperature: { type: "number", exclusiveMinimum: 0 },
    pressure: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["potentialTemperature", "pressure", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate theta=T*(referencePressure/pressure)^exponent at fixed temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { potentialTemperature, pressure, exponent } = request;
  const compute = (): Output => {
    H.positive(potentialTemperature);
    H.positive(pressure);
    return { derivative: (-exponent * potentialTemperature) / pressure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { potentialTemperature: 300, pressure: 100000, exponent: 0.286 },
  output: { derivative: -0.0008579999999999999 },
} satisfies ToolExample<Input, Output>;
export const potentialTemperaturePressureSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/potential-temperature-pressure-sensitivity",
      title: "Potential Temperature Pressure Sensitivity Tool",
      description:
        "Differentiate theta=T*(referencePressure/pressure)^exponent at fixed temperature.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          potentialTemperature: { type: "number", exclusiveMinimum: 0 },
          pressure: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number" },
        },
        required: ["potentialTemperature", "pressure", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "potentialTemperature",
            label: "Potential Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pressure",
            label: "Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = potentialTemperaturePressureSensitivityTool.execute;
export default potentialTemperaturePressureSensitivityTool;
