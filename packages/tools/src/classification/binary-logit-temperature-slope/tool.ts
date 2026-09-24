import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly logit: number; readonly temperature: number };
export type Output = {
  readonly probability: number;
  readonly logitSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logit: { type: "number" },
    temperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["logit", "temperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number" },
    logitSlope: { type: "number" },
  },
  required: ["probability", "logitSlope"],
} as const;
/** Evaluate sigmoid(logit/temperature) and its derivative with respect to the supplied logit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logit, temperature } = request;
  const compute = (): Output => {
    H.positive(temperature);
    return {
      probability:
        logit >= 0
          ? 1 / (1 + Math.exp(-logit / temperature))
          : Math.exp(logit / temperature) / (1 + Math.exp(logit / temperature)),
      logitSlope:
        Math.exp(-Math.abs(logit / temperature)) /
        (1 + Math.exp(-Math.abs(logit / temperature))) ** 2 /
        temperature,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logit: 0, temperature: 2 },
  output: { probability: 0.5, logitSlope: 0.125 },
} satisfies ToolExample<Input, Output>;
export const binaryLogitTemperatureSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-logit-temperature-slope",
    title: "Binary Logit Temperature Slope Tool",
    description:
      "Evaluate sigmoid(logit/temperature) and its derivative with respect to the supplied logit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logit: { type: "number" },
        temperature: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["logit", "temperature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number" },
        logitSlope: { type: "number" },
      },
      required: ["probability", "logitSlope"],
    },
    ports: {
      inputs: [
        {
          id: "logit",
          label: "Logit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
        {
          id: "logitSlope",
          label: "Logit Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryLogitTemperatureSlopeTool.execute;
export default binaryLogitTemperatureSlopeTool;
