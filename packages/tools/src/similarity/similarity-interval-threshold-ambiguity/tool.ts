import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly threshold: number;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    threshold: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lower", "upper", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Compute similarity interval threshold ambiguity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lower, upper, threshold } = input;
  const compute = (): Output => {
    probability(lower);
    probability(upper);
    probability(threshold);
    domain(lower <= upper);
    return {
      status:
        lower >= threshold
          ? "accepted"
          : upper < threshold
            ? "rejected"
            : "ambiguous",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: 0.25, upper: 0.75, threshold: 0.5 },
  output: { status: "ambiguous" },
} satisfies ToolExample<Input, Output>;
export const similarityIntervalThresholdAmbiguityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/similarity-interval-threshold-ambiguity",
  title: "Similarity Interval Threshold Ambiguity Tool",
  description:
    "Compute similarity interval threshold ambiguity from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
        id: "threshold",
        label: "Threshold",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "status", label: "Status", valueType: { type: "string" } }],
  },
});
export const run = similarityIntervalThresholdAmbiguityTool.execute;
export default similarityIntervalThresholdAmbiguityTool;
