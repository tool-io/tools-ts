import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorLeading: number;
  readonly denominatorLeading: number;
  readonly approachPositiveInfinity: boolean;
  readonly numeratorDegree: number;
  readonly denominatorDegree: number;
};
export type Output = {
  readonly leadingSign: number;
  readonly degreeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorLeading: { type: "number" },
    denominatorLeading: { type: "number" },
    approachPositiveInfinity: { type: "boolean" },
    numeratorDegree: { type: "integer", minimum: 0 },
    denominatorDegree: { type: "integer", minimum: 0 },
  },
  required: [
    "numeratorLeading",
    "denominatorLeading",
    "approachPositiveInfinity",
    "numeratorDegree",
    "denominatorDegree",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingSign: { type: "integer" },
    degreeDifference: { type: "integer" },
  },
  required: ["leadingSign", "degreeDifference"],
} as const;
/** Determine the rational leading-term sign on a chosen infinite ray from supplied nonzero leading coefficients and degrees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    numeratorLeading,
    denominatorLeading,
    approachPositiveInfinity,
    numeratorDegree,
    denominatorDegree,
  } = request;
  const compute = (): Output => {
    H.domain(numeratorLeading !== 0 && denominatorLeading !== 0);
    H.integer(numeratorDegree, 0);
    H.integer(denominatorDegree, 0);
    return {
      leadingSign:
        Math.sign(numeratorLeading) *
        Math.sign(denominatorLeading) *
        (approachPositiveInfinity ||
        (numeratorDegree - denominatorDegree) % 2 === 0
          ? 1
          : -1),
      degreeDifference: Number(
        BigInt(numeratorDegree) - BigInt(denominatorDegree),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    numeratorLeading: 2,
    denominatorLeading: -3,
    approachPositiveInfinity: true,
    numeratorDegree: 3,
    denominatorDegree: 1,
  },
  output: { leadingSign: -1, degreeDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const rationalLeadingTermSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/rational-leading-term-sign",
    title: "Rational Leading Term Sign Tool",
    description:
      "Determine the rational leading-term sign on a chosen infinite ray from supplied nonzero leading coefficients and degrees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorLeading: { type: "number" },
        denominatorLeading: { type: "number" },
        approachPositiveInfinity: { type: "boolean" },
        numeratorDegree: { type: "integer", minimum: 0 },
        denominatorDegree: { type: "integer", minimum: 0 },
      },
      required: [
        "numeratorLeading",
        "denominatorLeading",
        "approachPositiveInfinity",
        "numeratorDegree",
        "denominatorDegree",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingSign: { type: "integer" },
        degreeDifference: { type: "integer" },
      },
      required: ["leadingSign", "degreeDifference"],
    },
    ports: {
      inputs: [
        {
          id: "numeratorLeading",
          label: "Numerator Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominatorLeading",
          label: "Denominator Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "approachPositiveInfinity",
          label: "Approach Positive Infinity",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "numeratorDegree",
          label: "Numerator Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominatorDegree",
          label: "Denominator Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "leadingSign",
          label: "Leading Sign",
          valueType: { type: "integer" },
        },
        {
          id: "degreeDifference",
          label: "Degree Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalLeadingTermSignTool.execute;
export default rationalLeadingTermSignTool;
