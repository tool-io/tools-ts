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
  readonly score: number;
  readonly lower: number;
  readonly upper: number;
  readonly closed: boolean;
};
export type Output = { readonly reject: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 1 },
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    closed: { type: "boolean" },
  },
  required: ["score", "lower", "upper", "closed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reject: { type: "boolean" } },
  required: ["reject"],
} as const;
/** Compute prediction reject band membership from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { score, lower, upper, closed } = input;
  const compute = (): Output => {
    probability(score);
    probability(lower);
    probability(upper);
    domain(lower <= upper);
    return {
      reject: closed
        ? score >= lower && score <= upper
        : score > lower && score < upper,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { score: 0.4, lower: 0.4, upper: 0.6, closed: true },
  output: { reject: true },
} satisfies ToolExample<Input, Output>;
export const predictionRejectBandMembershipTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/prediction-reject-band-membership",
  title: "Prediction Reject Band Membership Tool",
  description:
    "Compute prediction reject band membership from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "score",
        label: "Score",
        required: true,
        valueType: { type: "number" },
      },
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
        id: "closed",
        label: "Closed",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "reject", label: "Reject", valueType: { type: "boolean" } },
    ],
  },
});
export const run = predictionRejectBandMembershipTool.execute;
export default predictionRejectBandMembershipTool;
