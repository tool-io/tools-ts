import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorValue: number;
  readonly denominatorValue: number;
  readonly numeratorScale: number;
  readonly denominatorScale: number;
  readonly reportScale: number;
};
export type Output = {
  readonly coherentRatio: number;
  readonly reportedRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorValue: { type: "number", minimum: 0 },
    denominatorValue: { type: "number", exclusiveMinimum: 0 },
    numeratorScale: { type: "number", exclusiveMinimum: 0 },
    denominatorScale: { type: "number", exclusiveMinimum: 0 },
    reportScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "numeratorValue",
    "denominatorValue",
    "numeratorScale",
    "denominatorScale",
    "reportScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coherentRatio: { type: "number" },
    reportedRatio: { type: "number" },
  },
  required: ["coherentRatio", "reportedRatio"],
} as const;
/** Explicit coherent-unit and reporting-factor ratio; no biomarker cutoff, molar mass or renal diagnosis is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    numeratorValue,
    denominatorValue,
    numeratorScale,
    denominatorScale,
    reportScale,
  } = request;
  const compute = (): Output => {
    H.domain(numeratorValue >= 0);
    H.positive(denominatorValue);
    H.positive(numeratorScale);
    H.positive(denominatorScale);
    H.positive(reportScale);
    return {
      coherentRatio:
        (numeratorValue * numeratorScale) /
        (denominatorValue * denominatorScale),
      reportedRatio:
        (numeratorValue * numeratorScale * reportScale) /
        (denominatorValue * denominatorScale),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    numeratorValue: 30,
    denominatorValue: 10,
    numeratorScale: 1,
    denominatorScale: 2,
    reportScale: 100,
  },
  output: { coherentRatio: 1.5, reportedRatio: 150 },
} satisfies ToolExample<Input, Output>;
export const urineCreatinineRatioUnitBasisCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/urine-creatinine-ratio-unit-basis-check",
    title: "Urine Creatinine Ratio Unit Basis Check Tool",
    description:
      "Explicit coherent-unit and reporting-factor ratio; no biomarker cutoff, molar mass or renal diagnosis is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorValue: { type: "number", minimum: 0 },
        denominatorValue: { type: "number", exclusiveMinimum: 0 },
        numeratorScale: { type: "number", exclusiveMinimum: 0 },
        denominatorScale: { type: "number", exclusiveMinimum: 0 },
        reportScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "numeratorValue",
        "denominatorValue",
        "numeratorScale",
        "denominatorScale",
        "reportScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coherentRatio: { type: "number" },
        reportedRatio: { type: "number" },
      },
      required: ["coherentRatio", "reportedRatio"],
    },
    ports: {
      inputs: [
        {
          id: "numeratorValue",
          label: "Numerator Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominatorValue",
          label: "Denominator Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "numeratorScale",
          label: "Numerator Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominatorScale",
          label: "Denominator Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportScale",
          label: "Report Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coherentRatio",
          label: "Coherent Ratio",
          valueType: { type: "number" },
        },
        {
          id: "reportedRatio",
          label: "Reported Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urineCreatinineRatioUnitBasisCheckTool.execute;
export default urineCreatinineRatioUnitBasisCheckTool;
