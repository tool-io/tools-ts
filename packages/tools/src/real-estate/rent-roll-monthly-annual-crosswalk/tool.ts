import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monthlyScheduledRent: number;
  readonly annualConcessions: number;
};
export type Output = {
  readonly annualScheduledRent: number;
  readonly annualNetScheduledRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monthlyScheduledRent: { type: "number", minimum: 0 },
    annualConcessions: { type: "number", minimum: 0 },
  },
  required: ["monthlyScheduledRent", "annualConcessions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualScheduledRent: { type: "number" },
    annualNetScheduledRent: { type: "number" },
  },
  required: ["annualScheduledRent", "annualNetScheduledRent"],
} as const;
/** Annualize a constant monthly rent roll and subtract explicitly annual concessions; vacancy and collection losses remain separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monthlyScheduledRent, annualConcessions } = request;
  const compute = (): Output => {
    H.domain(
      monthlyScheduledRent >= 0 && annualConcessions >= 0,
      "monthlyScheduledRent",
    );
    return {
      annualScheduledRent: monthlyScheduledRent * 12,
      annualNetScheduledRent: monthlyScheduledRent * 12 - annualConcessions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { monthlyScheduledRent: 2000, annualConcessions: 1200 },
  output: { annualScheduledRent: 24000, annualNetScheduledRent: 22800 },
} satisfies ToolExample<Input, Output>;
export const rentRollMonthlyAnnualCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/rent-roll-monthly-annual-crosswalk",
    title: "Rent Roll Monthly Annual Crosswalk",
    description:
      "Annualize a constant monthly rent roll and subtract explicitly annual concessions; vacancy and collection losses remain separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monthlyScheduledRent: { type: "number", minimum: 0 },
        annualConcessions: { type: "number", minimum: 0 },
      },
      required: ["monthlyScheduledRent", "annualConcessions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualScheduledRent: { type: "number" },
        annualNetScheduledRent: { type: "number" },
      },
      required: ["annualScheduledRent", "annualNetScheduledRent"],
    },
    ports: {
      inputs: [
        {
          id: "monthlyScheduledRent",
          label: "Monthly Scheduled Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualConcessions",
          label: "Annual Concessions",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "annualScheduledRent",
          label: "Annual Scheduled Rent",
          valueType: { type: "number" },
        },
        {
          id: "annualNetScheduledRent",
          label: "Annual Net Scheduled Rent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentRollMonthlyAnnualCrosswalkTool.execute;
export default rentRollMonthlyAnnualCrosswalkTool;
