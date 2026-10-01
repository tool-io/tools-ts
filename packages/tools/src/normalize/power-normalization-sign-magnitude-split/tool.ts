import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly power: number };
export type Output = {
  readonly sign: number;
  readonly magnitude: number;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    power: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "power"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sign: { type: "integer" },
    magnitude: { type: "number" },
    normalized: { type: "number" },
  },
  required: ["sign", "magnitude", "normalized"],
} as const;
/** Calculate power normalization sign magnitude split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, power } = request;
  const compute = (): Output => {
    H.positive(power);
    const sign = Math.sign(value),
      magnitude = Math.abs(value) ** power;
    return { sign, magnitude, normalized: sign * magnitude };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: -4, power: 0.5 },
  output: { sign: -1, magnitude: 2, normalized: -2 },
} satisfies ToolExample<Input, Output>;
export const powerNormalizationSignMagnitudeSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/power-normalization-sign-magnitude-split",
      title: "Power Normalization Sign Magnitude Split Tool",
      description:
        "Calculate power normalization sign magnitude split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          power: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["value", "power"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sign: { type: "integer" },
          magnitude: { type: "number" },
          normalized: { type: "number" },
        },
        required: ["sign", "magnitude", "normalized"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "power",
            label: "Power",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "sign", label: "Sign", valueType: { type: "integer" } },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = powerNormalizationSignMagnitudeSplitTool.execute;
export default powerNormalizationSignMagnitudeSplitTool;
