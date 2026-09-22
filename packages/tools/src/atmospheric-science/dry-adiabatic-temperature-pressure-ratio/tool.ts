import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialTemperature: number;
  readonly initialPressure: number;
  readonly finalPressure: number;
  readonly exponent: number;
};
export type Output = { readonly temperature: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialTemperature: { type: "number", exclusiveMinimum: 0 },
    initialPressure: { type: "number", exclusiveMinimum: 0 },
    finalPressure: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: [
    "initialTemperature",
    "initialPressure",
    "finalPressure",
    "exponent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temperature: { type: "number" } },
  required: ["temperature"],
} as const;
/** Calculate dry adiabatic temperature pressure ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialTemperature, initialPressure, finalPressure, exponent } =
    request;
  const compute = (): Output => {
    H.positive(initialTemperature);
    H.positive(initialPressure);
    H.positive(finalPressure);
    return {
      temperature:
        initialTemperature * (finalPressure / initialPressure) ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialTemperature: 300,
    initialPressure: 100000,
    finalPressure: 50000,
    exponent: 0.25,
  },
  output: { temperature: 252.26892457611436 },
} satisfies ToolExample<Input, Output>;
export const dryAdiabaticTemperaturePressureRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/dry-adiabatic-temperature-pressure-ratio",
      title: "Dry Adiabatic Temperature Pressure Ratio Tool",
      description:
        "Calculate dry adiabatic temperature pressure ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialTemperature: { type: "number", exclusiveMinimum: 0 },
          initialPressure: { type: "number", exclusiveMinimum: 0 },
          finalPressure: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number" },
        },
        required: [
          "initialTemperature",
          "initialPressure",
          "finalPressure",
          "exponent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { temperature: { type: "number" } },
        required: ["temperature"],
      },
      ports: {
        inputs: [
          {
            id: "initialTemperature",
            label: "Initial Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialPressure",
            label: "Initial Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalPressure",
            label: "Final Pressure",
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
            id: "temperature",
            label: "Temperature",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dryAdiabaticTemperaturePressureRatioTool.execute;
export default dryAdiabaticTemperaturePressureRatioTool;
