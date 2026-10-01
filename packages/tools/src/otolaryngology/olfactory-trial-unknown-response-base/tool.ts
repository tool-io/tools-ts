import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correct: number;
  readonly incorrect: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly correctFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "integer", minimum: 0 },
    incorrect: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["correct", "incorrect", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    correctFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "correctFraction", "defined"],
} as const;
/** Audit research trial response denominators without selecting an olfactory test or diagnostic cutoff. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correct, incorrect, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(correct, 0);
    H.integer(incorrect, 0);
    H.integer(unknown, 0);
    return {
      denominator: correct + incorrect + (includeUnknown ? unknown : 0),
      correctFraction:
        correct + incorrect + (includeUnknown ? unknown : 0) > 0
          ? correct / (correct + incorrect + (includeUnknown ? unknown : 0))
          : 0,
      defined: correct + incorrect + (includeUnknown ? unknown : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correct: 6, incorrect: 2, unknown: 2, includeUnknown: true },
  output: { denominator: 10, correctFraction: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const olfactoryTrialUnknownResponseBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/olfactory-trial-unknown-response-base",
    title: "Olfactory Trial Unknown Response Base Tool",
    description:
      "Audit research trial response denominators without selecting an olfactory test or diagnostic cutoff.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correct: { type: "integer", minimum: 0 },
        incorrect: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["correct", "incorrect", "unknown", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        correctFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "correctFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "incorrect",
          label: "Incorrect",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
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
          id: "correctFraction",
          label: "Correct Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = olfactoryTrialUnknownResponseBaseTool.execute;
export default olfactoryTrialUnknownResponseBaseTool;
