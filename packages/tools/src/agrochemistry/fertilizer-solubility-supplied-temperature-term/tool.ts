import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly firstTemperature: number;
  readonly secondTemperature: number;
  readonly firstSolubility: number;
  readonly secondSolubility: number;
};
export type Output = { readonly interpolated: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    firstTemperature: { type: "number" },
    secondTemperature: { type: "number" },
    firstSolubility: { type: "number", minimum: 0 },
    secondSolubility: { type: "number", minimum: 0 },
  },
  required: [
    "temperature",
    "firstTemperature",
    "secondTemperature",
    "firstSolubility",
    "secondSolubility",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interpolated: { type: "number" } },
  required: ["interpolated"],
} as const;
/** Interpolate supplied matched solubility observations without extrapolation or a dissolution procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    temperature,
    firstTemperature,
    secondTemperature,
    firstSolubility,
    secondSolubility,
  } = request;
  const compute = (): Output => {
    H.domain(
      secondTemperature > firstTemperature &&
        temperature >= firstTemperature &&
        temperature <= secondTemperature &&
        firstSolubility >= 0 &&
        secondSolubility >= 0,
    );
    return {
      interpolated:
        firstSolubility +
        ((secondSolubility - firstSolubility) *
          (temperature - firstTemperature)) /
          (secondTemperature - firstTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperature: 25,
    firstTemperature: 20,
    secondTemperature: 30,
    firstSolubility: 10,
    secondSolubility: 20,
  },
  output: { interpolated: 15 },
} satisfies ToolExample<Input, Output>;
export const fertilizerSolubilitySuppliedTemperatureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/fertilizer-solubility-supplied-temperature-term",
      title: "Fertilizer Solubility Supplied Temperature Term Tool",
      description:
        "Interpolate supplied matched solubility observations without extrapolation or a dissolution procedure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperature: { type: "number" },
          firstTemperature: { type: "number" },
          secondTemperature: { type: "number" },
          firstSolubility: { type: "number", minimum: 0 },
          secondSolubility: { type: "number", minimum: 0 },
        },
        required: [
          "temperature",
          "firstTemperature",
          "secondTemperature",
          "firstSolubility",
          "secondSolubility",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { interpolated: { type: "number" } },
        required: ["interpolated"],
      },
      ports: {
        inputs: [
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstTemperature",
            label: "First Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondTemperature",
            label: "Second Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstSolubility",
            label: "First Solubility",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondSolubility",
            label: "Second Solubility",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "interpolated",
            label: "Interpolated",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fertilizerSolubilitySuppliedTemperatureTermTool.execute;
export default fertilizerSolubilitySuppliedTemperatureTermTool;
