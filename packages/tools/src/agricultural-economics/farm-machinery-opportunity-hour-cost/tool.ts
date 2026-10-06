import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alternativeNetEarnings: number;
  readonly alternativeHours: number;
  readonly machineryHours: number;
};
export type Output = {
  readonly opportunityCostPerHour: number;
  readonly imputedOpportunityCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alternativeNetEarnings: { type: "number", minimum: 0 },
    alternativeHours: { type: "number", exclusiveMinimum: 0 },
    machineryHours: { type: "number", minimum: 0 },
  },
  required: ["alternativeNetEarnings", "alternativeHours", "machineryHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunityCostPerHour: { type: "number" },
    imputedOpportunityCost: { type: "number" },
  },
  required: ["opportunityCostPerHour", "imputedOpportunityCost"],
} as const;
/** Value machinery time at an explicitly supplied foregone alternative net earning rate without estimating a market rental rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alternativeNetEarnings, alternativeHours, machineryHours } = request;
  const compute = (): Output => {
    H.domain(
      alternativeNetEarnings >= 0 && machineryHours >= 0,
      "alternativeNetEarnings",
    );
    (H.domain(alternativeHours > 0, "alternativeHours"), alternativeHours);
    return {
      opportunityCostPerHour: alternativeNetEarnings / alternativeHours,
      imputedOpportunityCost:
        (alternativeNetEarnings / alternativeHours) * machineryHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alternativeNetEarnings: 600,
    alternativeHours: 20,
    machineryHours: 5,
  },
  output: { opportunityCostPerHour: 30, imputedOpportunityCost: 150 },
} satisfies ToolExample<Input, Output>;
export const farmMachineryOpportunityHourCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/farm-machinery-opportunity-hour-cost",
    title: "Farm Machinery Opportunity Hour Cost",
    description:
      "Value machinery time at an explicitly supplied foregone alternative net earning rate without estimating a market rental rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alternativeNetEarnings: { type: "number", minimum: 0 },
        alternativeHours: { type: "number", exclusiveMinimum: 0 },
        machineryHours: { type: "number", minimum: 0 },
      },
      required: [
        "alternativeNetEarnings",
        "alternativeHours",
        "machineryHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opportunityCostPerHour: { type: "number" },
        imputedOpportunityCost: { type: "number" },
      },
      required: ["opportunityCostPerHour", "imputedOpportunityCost"],
    },
    ports: {
      inputs: [
        {
          id: "alternativeNetEarnings",
          label: "Alternative Net Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alternativeHours",
          label: "Alternative Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "machineryHours",
          label: "Machinery Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "opportunityCostPerHour",
          label: "Opportunity Cost Per Hour",
          valueType: { type: "number" },
        },
        {
          id: "imputedOpportunityCost",
          label: "Imputed Opportunity Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmMachineryOpportunityHourCostTool.execute;
export default farmMachineryOpportunityHourCostTool;
