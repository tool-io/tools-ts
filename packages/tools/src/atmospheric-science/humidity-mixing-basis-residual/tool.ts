import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mixingRatio: number;
  readonly suppliedSpecificHumidity: number;
};
export type Output = {
  readonly expectedSpecificHumidity: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixingRatio: { type: "number", minimum: 0 },
    suppliedSpecificHumidity: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["mixingRatio", "suppliedSpecificHumidity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSpecificHumidity: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedSpecificHumidity", "residual"],
} as const;
/** Calculate humidity mixing basis residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mixingRatio, suppliedSpecificHumidity } = request;
  const compute = (): Output => {
    H.domain(
      mixingRatio >= 0 &&
        suppliedSpecificHumidity >= 0 &&
        suppliedSpecificHumidity <= 1,
    );
    return {
      expectedSpecificHumidity: mixingRatio / (1 + mixingRatio),
      residual: suppliedSpecificHumidity - mixingRatio / (1 + mixingRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mixingRatio: 0.25, suppliedSpecificHumidity: 0.2 },
  output: { expectedSpecificHumidity: 0.2, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const humidityMixingBasisResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/humidity-mixing-basis-residual",
    title: "Humidity Mixing Basis Residual Tool",
    description:
      "Calculate humidity mixing basis residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mixingRatio: { type: "number", minimum: 0 },
        suppliedSpecificHumidity: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["mixingRatio", "suppliedSpecificHumidity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSpecificHumidity: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedSpecificHumidity", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "mixingRatio",
          label: "Mixing Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSpecificHumidity",
          label: "Supplied Specific Humidity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedSpecificHumidity",
          label: "Expected Specific Humidity",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = humidityMixingBasisResidualTool.execute;
export default humidityMixingBasisResidualTool;
