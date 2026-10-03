import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualTax: number;
  readonly allocatedDays: number;
  readonly yearDays: number;
  readonly sellerCredit: number;
};
export type Output = {
  readonly proratedTax: number;
  readonly netCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualTax: { type: "number", minimum: 0 },
    allocatedDays: { type: "integer", minimum: 0 },
    yearDays: { type: "integer", minimum: 1 },
    sellerCredit: { type: "number", minimum: 0 },
  },
  required: ["annualTax", "allocatedDays", "yearDays", "sellerCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proratedTax: { type: "number" },
    netCharge: { type: "number" },
  },
  required: ["proratedTax", "netCharge"],
} as const;
/** Caller supplies allocation and year-day basis; no closing-date convention or jurisdiction rule is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualTax, allocatedDays, yearDays, sellerCredit } = request;
  const compute = (): Output => {
    H.domain(annualTax >= 0 && sellerCredit >= 0);
    H.integer(yearDays, 1);
    H.integer(allocatedDays, 0, yearDays);
    return {
      proratedTax: (annualTax * allocatedDays) / yearDays,
      netCharge: (annualTax * allocatedDays) / yearDays - sellerCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annualTax: 3600,
    allocatedDays: 90,
    yearDays: 360,
    sellerCredit: 100,
  },
  output: { proratedTax: 900, netCharge: 800 },
} satisfies ToolExample<Input, Output>;
export const propertyTaxCallerProrationDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/property-tax-caller-proration-day-count",
    title: "Property Tax Caller Proration Day Count Tool",
    description:
      "Caller supplies allocation and year-day basis; no closing-date convention or jurisdiction rule is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualTax: { type: "number", minimum: 0 },
        allocatedDays: { type: "integer", minimum: 0 },
        yearDays: { type: "integer", minimum: 1 },
        sellerCredit: { type: "number", minimum: 0 },
      },
      required: ["annualTax", "allocatedDays", "yearDays", "sellerCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proratedTax: { type: "number" },
        netCharge: { type: "number" },
      },
      required: ["proratedTax", "netCharge"],
    },
    ports: {
      inputs: [
        {
          id: "annualTax",
          label: "Annual Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedDays",
          label: "Allocated Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sellerCredit",
          label: "Seller Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "proratedTax",
          label: "Prorated Tax",
          valueType: { type: "number" },
        },
        { id: "netCharge", label: "Net Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = propertyTaxCallerProrationDayCountTool.execute;
export default propertyTaxCallerProrationDayCountTool;
