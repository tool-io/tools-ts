import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answered: number;
  readonly missing: number;
  readonly optedOut: number;
  readonly excludeOptOut: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    optedOut: { type: "integer", minimum: 0 },
    excludeOptOut: { type: "boolean" },
  },
  required: ["answered", "missing", "optedOut", "excludeOptOut"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["denominator", "fraction"],
} as const;
/** Calculate farmer feedback answered item fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answered, missing, optedOut, excludeOptOut } = request;
  const compute = (): Output => {
    H.integer(answered, 0);
    H.integer(missing, 0);
    H.integer(optedOut, 0);
    H.domain(answered + missing > 0);
    return {
      denominator: answered + missing + (excludeOptOut ? 0 : optedOut),
      fraction:
        answered / (answered + missing + (excludeOptOut ? 0 : optedOut)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { answered: 8, missing: 2, optedOut: 2, excludeOptOut: true },
  output: { denominator: 10, fraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const farmerFeedbackAnsweredItemFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farmer-feedback-answered-item-fraction",
    title: "Farmer Feedback Answered Item Fraction Tool",
    description:
      "Calculate farmer feedback answered item fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answered: { type: "integer", minimum: 0 },
        missing: { type: "integer", minimum: 0 },
        optedOut: { type: "integer", minimum: 0 },
        excludeOptOut: { type: "boolean" },
      },
      required: ["answered", "missing", "optedOut", "excludeOptOut"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        fraction: { type: "number" },
      },
      required: ["denominator", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "answered",
          label: "Answered",
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
          id: "optedOut",
          label: "Opted Out",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeOptOut",
          label: "Exclude Opt Out",
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
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmerFeedbackAnsweredItemFractionTool.execute;
export default farmerFeedbackAnsweredItemFractionTool;
