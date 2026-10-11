import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedValue: number;
  readonly suppliedZero: number;
};
export type Output = { readonly zeroCorrectedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedValue: { type: "number" },
    suppliedZero: { type: "number" },
  },
  required: ["observedValue", "suppliedZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroCorrectedValue: { type: "number" } },
  required: ["zeroCorrectedValue"],
} as const;
/** Subtract an explicit pulmonary gas-analyzer zero reading without interpreting a gas exchange measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedValue, suppliedZero } = request;
  const compute = (): Output => {
    return { zeroCorrectedValue: observedValue - suppliedZero };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedValue: 5.2, suppliedZero: 0.2 },
  output: { zeroCorrectedValue: 5 },
} satisfies ToolExample<Input, Output>;
export const pulmonaryGasAnalyzerZeroOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/pulmonary-gas-analyzer-zero-offset",
    title: "Pulmonary Gas Analyzer Zero Offset",
    description:
      "Subtract an explicit pulmonary gas-analyzer zero reading without interpreting a gas exchange measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedValue: { type: "number" },
        suppliedZero: { type: "number" },
      },
      required: ["observedValue", "suppliedZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { zeroCorrectedValue: { type: "number" } },
      required: ["zeroCorrectedValue"],
    },
    ports: {
      inputs: [
        {
          id: "observedValue",
          label: "Observed Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZero",
          label: "Supplied Zero",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "zeroCorrectedValue",
          label: "Zero Corrected Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pulmonaryGasAnalyzerZeroOffsetTool.execute;
export default pulmonaryGasAnalyzerZeroOffsetTool;
