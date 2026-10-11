import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dailyLostRent: number;
  readonly vacantDays: number;
  readonly dailyHoldingCost: number;
};
export type Output = {
  readonly lostRent: number;
  readonly holdingCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dailyLostRent: { type: "number", minimum: 0 },
    vacantDays: { type: "integer", minimum: 0 },
    dailyHoldingCost: { type: "number", minimum: 0 },
  },
  required: ["dailyLostRent", "vacantDays", "dailyHoldingCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostRent: { type: "number" },
    holdingCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["lostRent", "holdingCost", "totalCost"],
} as const;
/** Add explicitly supplied lost rent and incremental holding cost for a fixed number of vacancy days, avoiding overlapping cost categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dailyLostRent, vacantDays, dailyHoldingCost } = request;
  const compute = (): Output => {
    H.domain(dailyLostRent >= 0 && dailyHoldingCost >= 0, "dailyLostRent");
    (H.domain(
      Number.isSafeInteger(vacantDays) &&
        vacantDays >= 0 &&
        vacantDays <= Number.MAX_SAFE_INTEGER,
      "vacantDays",
    ),
      vacantDays);
    return {
      lostRent: dailyLostRent * vacantDays,
      holdingCost: dailyHoldingCost * vacantDays,
      totalCost: (dailyLostRent + dailyHoldingCost) * vacantDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dailyLostRent: 40, vacantDays: 10, dailyHoldingCost: 5 },
  output: { lostRent: 400, holdingCost: 50, totalCost: 450 },
} satisfies ToolExample<Input, Output>;
export const unitVacancyDayCostTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/unit-vacancy-day-cost",
    title: "Unit Vacancy Day Cost",
    description:
      "Add explicitly supplied lost rent and incremental holding cost for a fixed number of vacancy days, avoiding overlapping cost categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dailyLostRent: { type: "number", minimum: 0 },
        vacantDays: { type: "integer", minimum: 0 },
        dailyHoldingCost: { type: "number", minimum: 0 },
      },
      required: ["dailyLostRent", "vacantDays", "dailyHoldingCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostRent: { type: "number" },
        holdingCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["lostRent", "holdingCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "dailyLostRent",
          label: "Daily Lost Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vacantDays",
          label: "Vacant Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dailyHoldingCost",
          label: "Daily Holding Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lostRent", label: "Lost Rent", valueType: { type: "number" } },
        {
          id: "holdingCost",
          label: "Holding Cost",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = unitVacancyDayCostTool.execute;
export default unitVacancyDayCostTool;
