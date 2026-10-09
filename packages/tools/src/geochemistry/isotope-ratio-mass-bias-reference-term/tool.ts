import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredRatio: number;
  readonly referenceRatio: number;
  readonly numeratorToDenominatorMassRatio: number;
};
export type Output = { readonly massBiasExponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredRatio: { type: "number", exclusiveMinimum: 0 },
    referenceRatio: { type: "number", exclusiveMinimum: 0 },
    numeratorToDenominatorMassRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredRatio",
    "referenceRatio",
    "numeratorToDenominatorMassRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massBiasExponent: { type: "number" } },
  required: ["massBiasExponent"],
} as const;
/** Solve beta from measured/reference isotope ratio=(numerator/denominator isotope mass ratio)^beta using the explicitly ordered mass ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredRatio, referenceRatio, numeratorToDenominatorMassRatio } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(measuredRatio) && measuredRatio > 0,
      "measuredRatio",
    ),
      measuredRatio);
    (H.domain(
      Number.isFinite(referenceRatio) && referenceRatio > 0,
      "referenceRatio",
    ),
      referenceRatio);
    H.domain(
      numeratorToDenominatorMassRatio > 0 &&
        numeratorToDenominatorMassRatio !== 1,
      "numeratorToDenominatorMassRatio",
    );
    return {
      massBiasExponent:
        (Math.log(measuredRatio) - Math.log(referenceRatio)) /
        Math.log(numeratorToDenominatorMassRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredRatio: 4,
    referenceRatio: 2,
    numeratorToDenominatorMassRatio: 2,
  },
  output: { massBiasExponent: 1 },
} satisfies ToolExample<Input, Output>;
export const isotopeRatioMassBiasReferenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-ratio-mass-bias-reference-term",
    title: "Isotope Ratio Mass Bias Reference Term Tool",
    description:
      "Solve beta from measured/reference isotope ratio=(numerator/denominator isotope mass ratio)^beta using the explicitly ordered mass ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredRatio: { type: "number", exclusiveMinimum: 0 },
        referenceRatio: { type: "number", exclusiveMinimum: 0 },
        numeratorToDenominatorMassRatio: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: [
        "measuredRatio",
        "referenceRatio",
        "numeratorToDenominatorMassRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massBiasExponent: { type: "number" } },
      required: ["massBiasExponent"],
    },
    ports: {
      inputs: [
        {
          id: "measuredRatio",
          label: "Measured Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "numeratorToDenominatorMassRatio",
          label: "Numerator To Denominator Mass Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massBiasExponent",
          label: "Mass Bias Exponent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeRatioMassBiasReferenceTermTool.execute;
export default isotopeRatioMassBiasReferenceTermTool;
