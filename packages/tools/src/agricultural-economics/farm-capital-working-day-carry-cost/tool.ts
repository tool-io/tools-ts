import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capitalAmount: number;
  readonly dailyCarryRate: number;
  readonly workingDays: number;
};
export type Output = { readonly carryCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capitalAmount: { type: "number", minimum: 0 },
    dailyCarryRate: { type: "number" },
    workingDays: { type: "integer", minimum: 0 },
  },
  required: ["capitalAmount", "dailyCarryRate", "workingDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carryCost: { type: "number" } },
  required: ["carryCost"],
} as const;
/** Multiply explicit farm working capital, signed daily carry rate and supplied working-day count without constructing a holiday calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capitalAmount, dailyCarryRate, workingDays } = request;
  const compute = (): Output => {
    H.domain(capitalAmount >= 0, "capitalAmount");
    (H.domain(
      Number.isSafeInteger(workingDays) &&
        workingDays >= 0 &&
        workingDays <= Number.MAX_SAFE_INTEGER,
      "workingDays",
    ),
      workingDays);
    return { carryCost: capitalAmount * dailyCarryRate * workingDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capitalAmount: 2000, dailyCarryRate: 0.001, workingDays: 5 },
  output: { carryCost: 10 },
} satisfies ToolExample<Input, Output>;
export const farmCapitalWorkingDayCarryCostTool = H.defineSchemaCalculation<
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
    id: "agricultural-economics/farm-capital-working-day-carry-cost",
    title: "Farm Capital Working Day Carry Cost",
    description:
      "Multiply explicit farm working capital, signed daily carry rate and supplied working-day count without constructing a holiday calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capitalAmount: { type: "number", minimum: 0 },
        dailyCarryRate: { type: "number" },
        workingDays: { type: "integer", minimum: 0 },
      },
      required: ["capitalAmount", "dailyCarryRate", "workingDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carryCost: { type: "number" } },
      required: ["carryCost"],
    },
    ports: {
      inputs: [
        {
          id: "capitalAmount",
          label: "Capital Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyCarryRate",
          label: "Daily Carry Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workingDays",
          label: "Working Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "carryCost", label: "Carry Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmCapitalWorkingDayCarryCostTool.execute;
export default farmCapitalWorkingDayCarryCostTool;
