import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimate: number;
  readonly decimalPlaces: number;
  readonly nullValue: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly canIncludeNull: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimate: { type: "number" },
    decimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
    nullValue: { type: "number" },
  },
  required: ["estimate", "decimalPlaces", "nullValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    canIncludeNull: { type: "boolean" },
  },
  required: ["lower", "upper", "canIncludeNull"],
} as const;
/** Envelope an explicitly rounded effect estimate, separate from statistical uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimate, decimalPlaces, nullValue } = request;
  const compute = (): Output => {
    H.integer(decimalPlaces, 0, 15);
    return {
      lower: estimate - 0.5 * 10 ** -decimalPlaces,
      upper: estimate + 0.5 * 10 ** -decimalPlaces,
      canIncludeNull:
        nullValue >= estimate - 0.5 * 10 ** -decimalPlaces &&
        nullValue <= estimate + 0.5 * 10 ** -decimalPlaces,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { estimate: 0.2, decimalPlaces: 1, nullValue: 0 },
  output: { lower: 0.15000000000000002, upper: 0.25, canIncludeNull: false },
} satisfies ToolExample<Input, Output>;
export const chiropracticReviewEffectEstimateRoundingEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-review-effect-estimate-rounding-envelope",
      title: "Chiropractic Review Effect Estimate Rounding Envelope Tool",
      description:
        "Envelope an explicitly rounded effect estimate, separate from statistical uncertainty.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          estimate: { type: "number" },
          decimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
          nullValue: { type: "number" },
        },
        required: ["estimate", "decimalPlaces", "nullValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number" },
          upper: { type: "number" },
          canIncludeNull: { type: "boolean" },
        },
        required: ["lower", "upper", "canIncludeNull"],
      },
      ports: {
        inputs: [
          {
            id: "estimate",
            label: "Estimate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "decimalPlaces",
            label: "Decimal Places",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nullValue",
            label: "Null Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
          {
            id: "canIncludeNull",
            label: "Can Include Null",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticReviewEffectEstimateRoundingEnvelopeTool.execute;
export default chiropracticReviewEffectEstimateRoundingEnvelopeTool;
