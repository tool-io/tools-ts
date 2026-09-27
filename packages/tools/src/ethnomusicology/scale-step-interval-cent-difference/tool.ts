import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRatio: number;
  readonly secondRatio: number;
  readonly periodRatio: number;
  readonly wrap: boolean;
};
export type Output = {
  readonly rawCents: number;
  readonly intervalCents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRatio: { type: "number", exclusiveMinimum: 0 },
    secondRatio: { type: "number", exclusiveMinimum: 0 },
    periodRatio: { type: "number", exclusiveMinimum: 1 },
    wrap: { type: "boolean" },
  },
  required: ["firstRatio", "secondRatio", "periodRatio", "wrap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawCents: { type: "number" },
    intervalCents: { type: "number" },
  },
  required: ["rawCents", "intervalCents"],
} as const;
/** Interval cents with optional upward wrap into an explicit period ratio, which need not be an octave. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRatio, secondRatio, periodRatio, wrap } = request;
  const compute = (): Output => {
    const modulo = (value: number, modulus: number): number => {
      const remainder = value % modulus;
      const positive = remainder < 0 ? remainder + modulus : remainder;
      return positive === modulus ? 0 : positive;
    };
    H.positive(firstRatio);
    H.positive(secondRatio);
    H.domain(periodRatio > 1);
    return {
      rawCents: 1200 * Math.log2(secondRatio / firstRatio),
      intervalCents: wrap
        ? 1200 *
          modulo(Math.log2(secondRatio / firstRatio), Math.log2(periodRatio))
        : 1200 * Math.log2(secondRatio / firstRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRatio: 1, secondRatio: 1.5, periodRatio: 2, wrap: false },
  output: { rawCents: 701.9550008653874, intervalCents: 701.9550008653874 },
} satisfies ToolExample<Input, Output>;
export const scaleStepIntervalCentDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/scale-step-interval-cent-difference",
    title: "Scale Step Interval Cent Difference Tool",
    description:
      "Interval cents with optional upward wrap into an explicit period ratio, which need not be an octave.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRatio: { type: "number", exclusiveMinimum: 0 },
        secondRatio: { type: "number", exclusiveMinimum: 0 },
        periodRatio: { type: "number", exclusiveMinimum: 1 },
        wrap: { type: "boolean" },
      },
      required: ["firstRatio", "secondRatio", "periodRatio", "wrap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawCents: { type: "number" },
        intervalCents: { type: "number" },
      },
      required: ["rawCents", "intervalCents"],
    },
    ports: {
      inputs: [
        {
          id: "firstRatio",
          label: "First Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRatio",
          label: "Second Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodRatio",
          label: "Period Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wrap",
          label: "Wrap",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "rawCents", label: "Raw Cents", valueType: { type: "number" } },
        {
          id: "intervalCents",
          label: "Interval Cents",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaleStepIntervalCentDifferenceTool.execute;
export default scaleStepIntervalCentDifferenceTool;
