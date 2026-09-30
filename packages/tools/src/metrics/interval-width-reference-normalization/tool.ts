import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly referenceSpan: number;
};
export type Output = { readonly normalizedWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    referenceSpan: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lower", "upper", "referenceSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedWidth: { type: "number" } },
  required: ["normalizedWidth"],
} as const;
/** Calculate interval width reference normalization from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lower, upper, referenceSpan } = input;
  const compute = (): Output => {
    H.domain(lower <= upper);
    H.positive(referenceSpan);
    return { normalizedWidth: (upper - lower) / referenceSpan };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: 2, upper: 8, referenceSpan: 12 },
  output: { normalizedWidth: 0.5 },
} satisfies ToolExample<Input, Output>;
export const intervalWidthReferenceNormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/interval-width-reference-normalization",
      title: "Interval Width Reference Normalization Tool",
      description:
        "Calculate interval width reference normalization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number" },
          upper: { type: "number" },
          referenceSpan: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["lower", "upper", "referenceSpan"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalizedWidth: { type: "number" } },
        required: ["normalizedWidth"],
      },
      ports: {
        inputs: [
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceSpan",
            label: "Reference Span",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedWidth",
            label: "Normalized Width",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = intervalWidthReferenceNormalizationTool.execute;
export default intervalWidthReferenceNormalizationTool;
