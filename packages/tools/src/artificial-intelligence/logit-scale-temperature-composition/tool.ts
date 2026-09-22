import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scale: number;
  readonly temperature: number;
  readonly extraTemperature: number;
};
export type Output = {
  readonly effectiveScale: number;
  readonly equivalentTemperature: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scale: { type: "number", exclusiveMinimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
    extraTemperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["scale", "temperature", "extraTemperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveScale: { type: "number" },
    equivalentTemperature: { type: "number" },
  },
  required: ["effectiveScale", "equivalentTemperature"],
} as const;
/** Compose positive multiplicative logit scale and two temperatures before softmax. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scale, temperature, extraTemperature } = request;
  const compute = (): Output => {
    H.positive(scale);
    H.positive(temperature);
    H.positive(extraTemperature);
    return {
      effectiveScale: scale / temperature / extraTemperature,
      equivalentTemperature: (temperature * extraTemperature) / scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scale: 2, temperature: 4, extraTemperature: 0.5 },
  output: { effectiveScale: 1, equivalentTemperature: 1 },
} satisfies ToolExample<Input, Output>;
export const logitScaleTemperatureCompositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/logit-scale-temperature-composition",
    title: "Logit Scale Temperature Composition Tool",
    description:
      "Compose positive multiplicative logit scale and two temperatures before softmax.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scale: { type: "number", exclusiveMinimum: 0 },
        temperature: { type: "number", exclusiveMinimum: 0 },
        extraTemperature: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["scale", "temperature", "extraTemperature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveScale: { type: "number" },
        equivalentTemperature: { type: "number" },
      },
      required: ["effectiveScale", "equivalentTemperature"],
    },
    ports: {
      inputs: [
        {
          id: "scale",
          label: "Scale",
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
          id: "extraTemperature",
          label: "Extra Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveScale",
          label: "Effective Scale",
          valueType: { type: "number" },
        },
        {
          id: "equivalentTemperature",
          label: "Equivalent Temperature",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logitScaleTemperatureCompositionTool.execute;
export default logitScaleTemperatureCompositionTool;
