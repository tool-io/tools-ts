import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly capacitance: number; readonly ratio: number };
export type Output = { readonly reflected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitance: { type: "number", minimum: 0 },
    ratio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["capacitance", "ratio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reflected: { type: "number" } },
  required: ["reflected"],
} as const;
/** Reflect secondary capacitance to the primary for ratio N_primary/N_secondary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitance, ratio } = request;
  const compute = (): Output => {
    H.domain(capacitance >= 0);
    H.positive(ratio);
    return { reflected: capacitance / (ratio * ratio) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacitance: 8, ratio: 2 },
  output: { reflected: 2 },
} satisfies ToolExample<Input, Output>;
export const transformerTurnsRatioReflectedCapacitanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/transformer-turns-ratio-reflected-capacitance",
      title: "Transformer Turns Ratio Reflected Capacitance Tool",
      description:
        "Reflect secondary capacitance to the primary for ratio N_primary/N_secondary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacitance: { type: "number", minimum: 0 },
          ratio: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["capacitance", "ratio"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reflected: { type: "number" } },
        required: ["reflected"],
      },
      ports: {
        inputs: [
          {
            id: "capacitance",
            label: "Capacitance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ratio",
            label: "Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reflected",
            label: "Reflected",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transformerTurnsRatioReflectedCapacitanceTool.execute;
export default transformerTurnsRatioReflectedCapacitanceTool;
