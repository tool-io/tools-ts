import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly assessedPerArea: number;
  readonly exemptArea: number;
  readonly suppliedRate: number;
};
export type Output = { readonly taxableBase: number; readonly amount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    assessedPerArea: { type: "number", minimum: 0 },
    exemptArea: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", minimum: 0 },
  },
  required: ["area", "assessedPerArea", "exemptArea", "suppliedRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxableBase: { type: "number" }, amount: { type: "number" } },
  required: ["taxableBase", "amount"],
} as const;
/** Arithmetic under caller-supplied assessment and exemption assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, assessedPerArea, exemptArea, suppliedRate } = request;
  const compute = (): Output => {
    H.domain(
      area >= 0 &&
        assessedPerArea >= 0 &&
        exemptArea >= 0 &&
        exemptArea <= area &&
        suppliedRate >= 0,
    );
    return {
      taxableBase: (area - exemptArea) * assessedPerArea,
      amount: (area - exemptArea) * assessedPerArea * suppliedRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10, assessedPerArea: 1000, exemptArea: 2, suppliedRate: 0.01 },
  output: { taxableBase: 8000, amount: 80 },
} satisfies ToolExample<Input, Output>;
export const farmlandTaxCallerAssessmentBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/farmland-tax-caller-assessment-base",
    title: "Farmland Tax Caller Assessment Base Tool",
    description:
      "Arithmetic under caller-supplied assessment and exemption assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        assessedPerArea: { type: "number", minimum: 0 },
        exemptArea: { type: "number", minimum: 0 },
        suppliedRate: { type: "number", minimum: 0 },
      },
      required: ["area", "assessedPerArea", "exemptArea", "suppliedRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxableBase: { type: "number" },
        amount: { type: "number" },
      },
      required: ["taxableBase", "amount"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assessedPerArea",
          label: "Assessed Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemptArea",
          label: "Exempt Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "taxableBase",
          label: "Taxable Base",
          valueType: { type: "number" },
        },
        { id: "amount", label: "Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmlandTaxCallerAssessmentBaseTool.execute;
export default farmlandTaxCallerAssessmentBaseTool;
