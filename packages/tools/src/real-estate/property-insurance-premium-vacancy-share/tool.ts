import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualPremium: number;
  readonly vacantDays: number;
  readonly yearDays: number;
  readonly vacancyMultiplier: number;
};
export type Output = {
  readonly baseAllocated: number;
  readonly adjustedAllocated: number;
  readonly increment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualPremium: { type: "number", minimum: 0 },
    vacantDays: { type: "number", minimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
    vacancyMultiplier: { type: "number", minimum: 0 },
  },
  required: ["annualPremium", "vacantDays", "yearDays", "vacancyMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseAllocated: { type: "number" },
    adjustedAllocated: { type: "number" },
    increment: { type: "number" },
  },
  required: ["baseAllocated", "adjustedAllocated", "increment"],
} as const;
/** Pro rate a supplied premium and multiplier; this does not determine policy coverage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualPremium, vacantDays, yearDays, vacancyMultiplier } = request;
  const compute = (): Output => {
    H.domain(
      annualPremium >= 0 &&
        vacantDays >= 0 &&
        vacantDays <= yearDays &&
        vacancyMultiplier >= 0,
    );
    H.positive(yearDays);
    return {
      baseAllocated: (annualPremium * vacantDays) / yearDays,
      adjustedAllocated:
        ((annualPremium * vacantDays) / yearDays) * vacancyMultiplier,
      increment:
        ((annualPremium * vacantDays) / yearDays) * (vacancyMultiplier - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annualPremium: 3600,
    vacantDays: 90,
    yearDays: 360,
    vacancyMultiplier: 1.5,
  },
  output: { baseAllocated: 900, adjustedAllocated: 1350, increment: 450 },
} satisfies ToolExample<Input, Output>;
export const propertyInsurancePremiumVacancyShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "real-estate/property-insurance-premium-vacancy-share",
      title: "Property Insurance Premium Vacancy Share Tool",
      description:
        "Pro rate a supplied premium and multiplier; this does not determine policy coverage.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          annualPremium: { type: "number", minimum: 0 },
          vacantDays: { type: "number", minimum: 0 },
          yearDays: { type: "number", exclusiveMinimum: 0 },
          vacancyMultiplier: { type: "number", minimum: 0 },
        },
        required: [
          "annualPremium",
          "vacantDays",
          "yearDays",
          "vacancyMultiplier",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseAllocated: { type: "number" },
          adjustedAllocated: { type: "number" },
          increment: { type: "number" },
        },
        required: ["baseAllocated", "adjustedAllocated", "increment"],
      },
      ports: {
        inputs: [
          {
            id: "annualPremium",
            label: "Annual Premium",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vacantDays",
            label: "Vacant Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yearDays",
            label: "Year Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vacancyMultiplier",
            label: "Vacancy Multiplier",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baseAllocated",
            label: "Base Allocated",
            valueType: { type: "number" },
          },
          {
            id: "adjustedAllocated",
            label: "Adjusted Allocated",
            valueType: { type: "number" },
          },
          {
            id: "increment",
            label: "Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = propertyInsurancePremiumVacancyShareTool.execute;
export default propertyInsurancePremiumVacancyShareTool;
