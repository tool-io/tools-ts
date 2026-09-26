import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inductance: number; readonly ratio: number };
export type Output = { readonly reflected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductance: { type: "number", minimum: 0 },
    ratio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inductance", "ratio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reflected: { type: "number" } },
  required: ["reflected"],
} as const;
/** Reflect secondary inductance to the primary for ratio N_primary/N_secondary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inductance, ratio } = request;
  const compute = (): Output => {
    H.domain(inductance >= 0);
    H.positive(ratio);
    return { reflected: inductance * ratio * ratio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inductance: 2, ratio: 3 },
  output: { reflected: 18 },
} satisfies ToolExample<Input, Output>;
export const transformerTurnsRatioReflectedInductanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/transformer-turns-ratio-reflected-inductance",
      title: "Transformer Turns Ratio Reflected Inductance Tool",
      description:
        "Reflect secondary inductance to the primary for ratio N_primary/N_secondary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inductance: { type: "number", minimum: 0 },
          ratio: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["inductance", "ratio"],
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
            id: "inductance",
            label: "Inductance",
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
export const run = transformerTurnsRatioReflectedInductanceTool.execute;
export default transformerTurnsRatioReflectedInductanceTool;
