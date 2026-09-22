import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positive: number;
  readonly negative: number;
  readonly missing: number;
  readonly excludeMissing: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly positiveFraction: number;
  readonly missingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positive: { type: "integer", minimum: 0 },
    negative: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    excludeMissing: { type: "boolean" },
  },
  required: ["positive", "negative", "missing", "excludeMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    positiveFraction: { type: "number" },
    missingFraction: { type: "number" },
  },
  required: ["denominator", "positiveFraction", "missingFraction"],
} as const;
/** Calculate behavior observation missingness denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positive, negative, missing, excludeMissing } = request;
  const compute = (): Output => {
    H.integer(positive, 0);
    H.integer(negative, 0);
    H.integer(missing, 0);
    H.domain(positive + negative + (excludeMissing ? 0 : missing) > 0);
    return {
      denominator: positive + negative + (excludeMissing ? 0 : missing),
      positiveFraction:
        positive / (positive + negative + (excludeMissing ? 0 : missing)),
      missingFraction: missing / (positive + negative + missing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positive: 20, negative: 60, missing: 20, excludeMissing: true },
  output: { denominator: 80, positiveFraction: 0.25, missingFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const behaviorObservationMissingnessDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/behavior-observation-missingness-denominator",
      title: "Behavior Observation Missingness Denominator Tool",
      description:
        "Calculate behavior observation missingness denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positive: { type: "integer", minimum: 0 },
          negative: { type: "integer", minimum: 0 },
          missing: { type: "integer", minimum: 0 },
          excludeMissing: { type: "boolean" },
        },
        required: ["positive", "negative", "missing", "excludeMissing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          positiveFraction: { type: "number" },
          missingFraction: { type: "number" },
        },
        required: ["denominator", "positiveFraction", "missingFraction"],
      },
      ports: {
        inputs: [
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "negative",
            label: "Negative",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missing",
            label: "Missing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeMissing",
            label: "Exclude Missing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "positiveFraction",
            label: "Positive Fraction",
            valueType: { type: "number" },
          },
          {
            id: "missingFraction",
            label: "Missing Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = behaviorObservationMissingnessDenominatorTool.execute;
export default behaviorObservationMissingnessDenominatorTool;
