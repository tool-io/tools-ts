import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureK: number;
  readonly verticalTemperatureGradient: number;
  readonly gravity: number;
  readonly heatCapacity: number;
};
export type Output = { readonly frequencySquared: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    verticalTemperatureGradient: { type: "number" },
    gravity: { type: "number", exclusiveMinimum: 0 },
    heatCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "temperatureK",
    "verticalTemperatureGradient",
    "gravity",
    "heatCapacity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frequencySquared: { type: "number" } },
  required: ["frequencySquared"],
} as const;
/** Dry ideal-gas N squared with upward-positive temperature gradient, constant cp and SI units; moist stability is outside this model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureK, verticalTemperatureGradient, gravity, heatCapacity } =
    request;
  const compute = (): Output => {
    H.positive(temperatureK);
    H.positive(gravity);
    H.positive(heatCapacity);
    return {
      frequencySquared:
        (gravity / temperatureK) *
        (verticalTemperatureGradient + gravity / heatCapacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureK: 300,
    verticalTemperatureGradient: -0.005,
    gravity: 10,
    heatCapacity: 1000,
  },
  output: { frequencySquared: 0.00016666666666666666 },
} satisfies ToolExample<Input, Output>;
export const bruntVaisalaTemperatureGradientTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/brunt-vaisala-temperature-gradient-term",
      title: "Brunt Vaisala Temperature Gradient Term Tool",
      description:
        "Dry ideal-gas N squared with upward-positive temperature gradient, constant cp and SI units; moist stability is outside this model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureK: { type: "number", exclusiveMinimum: 0 },
          verticalTemperatureGradient: { type: "number" },
          gravity: { type: "number", exclusiveMinimum: 0 },
          heatCapacity: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "temperatureK",
          "verticalTemperatureGradient",
          "gravity",
          "heatCapacity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { frequencySquared: { type: "number" } },
        required: ["frequencySquared"],
      },
      ports: {
        inputs: [
          {
            id: "temperatureK",
            label: "Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "verticalTemperatureGradient",
            label: "Vertical Temperature Gradient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gravity",
            label: "Gravity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "heatCapacity",
            label: "Heat Capacity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "frequencySquared",
            label: "Frequency Squared",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bruntVaisalaTemperatureGradientTermTool.execute;
export default bruntVaisalaTemperatureGradientTermTool;
