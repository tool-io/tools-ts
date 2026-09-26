import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseAt: number;
  readonly phaseOrigin: number;
  readonly period: number;
  readonly suppliedReferenceFraction: number;
};
export type Output = {
  readonly phaseFraction: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseAt: { type: "number" },
    phaseOrigin: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "responseAt",
    "phaseOrigin",
    "period",
    "suppliedReferenceFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseFraction: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["phaseFraction", "referenceGap"],
} as const;
/** Compare a supplied nonclinical assay timestamp with an explicit cyclic reference, without inferring hormonal rhythms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseAt, phaseOrigin, period, suppliedReferenceFraction } =
    request;
  const compute = (): Output => {
    H.positive(period);
    H.probability(suppliedReferenceFraction);
    return (() => {
      const r = ((responseAt % period) - (phaseOrigin % period)) % period,
        p = r < 0 ? r + period : r,
        phaseFraction = (p === period ? 0 : p) / period;
      return {
        phaseFraction,
        referenceGap: phaseFraction - suppliedReferenceFraction,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseAt: 30,
    phaseOrigin: 0,
    period: 24,
    suppliedReferenceFraction: 0.2,
  },
  output: { phaseFraction: 0.25, referenceGap: 0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const assayResponsePhaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/assay-response-phase-gap",
    title: "Assay Response Phase Gap Tool",
    description:
      "Compare a supplied nonclinical assay timestamp with an explicit cyclic reference, without inferring hormonal rhythms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseAt: { type: "number" },
        phaseOrigin: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "responseAt",
        "phaseOrigin",
        "period",
        "suppliedReferenceFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseFraction: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["phaseFraction", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseOrigin",
          label: "Phase Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceFraction",
          label: "Supplied Reference Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayResponsePhaseGapTool.execute;
export default assayResponsePhaseGapTool;
