import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly ratingFactor: number;
  readonly allowanceFraction: number;
  readonly allowanceOfNormal: boolean;
};
export type Output = {
  readonly normalTime: number;
  readonly standardTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number", minimum: 0 },
    ratingFactor: { type: "number", exclusiveMinimum: 0 },
    allowanceFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    allowanceOfNormal: { type: "boolean" },
  },
  required: [
    "observedTime",
    "ratingFactor",
    "allowanceFraction",
    "allowanceOfNormal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalTime: { type: "number" },
    standardTime: { type: "number" },
  },
  required: ["normalTime", "standardTime"],
} as const;
/** Distinguish an allowance added to normal time from an allowance expressed as a fraction of total standard time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, ratingFactor, allowanceFraction, allowanceOfNormal } =
    request;
  const compute = (): Output => {
    H.domain(
      observedTime >= 0 &&
        ratingFactor > 0 &&
        allowanceFraction >= 0 &&
        allowanceFraction < 1,
    );
    return {
      normalTime: observedTime * ratingFactor,
      standardTime: allowanceOfNormal
        ? observedTime * ratingFactor * (1 + allowanceFraction)
        : (observedTime * ratingFactor) / (1 - allowanceFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedTime: 10,
    ratingFactor: 1.2,
    allowanceFraction: 0.2,
    allowanceOfNormal: true,
  },
  output: { normalTime: 12, standardTime: 14.399999999999999 },
} satisfies ToolExample<Input, Output>;
export const timeStudyRatingAllowanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/time-study-rating-allowance-factor",
    title: "Time Study Rating Allowance Factor Tool",
    description:
      "Distinguish an allowance added to normal time from an allowance expressed as a fraction of total standard time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number", minimum: 0 },
        ratingFactor: { type: "number", exclusiveMinimum: 0 },
        allowanceFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        allowanceOfNormal: { type: "boolean" },
      },
      required: [
        "observedTime",
        "ratingFactor",
        "allowanceFraction",
        "allowanceOfNormal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalTime: { type: "number" },
        standardTime: { type: "number" },
      },
      required: ["normalTime", "standardTime"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratingFactor",
          label: "Rating Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowanceFraction",
          label: "Allowance Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowanceOfNormal",
          label: "Allowance Of Normal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "normalTime",
          label: "Normal Time",
          valueType: { type: "number" },
        },
        {
          id: "standardTime",
          label: "Standard Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = timeStudyRatingAllowanceFactorTool.execute;
export default timeStudyRatingAllowanceFactorTool;
