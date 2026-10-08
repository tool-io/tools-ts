import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly entryFee: number; readonly dailyWage: number };
export type Output = { readonly wageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryFee: { type: "number", minimum: 0 },
    dailyWage: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["entryFee", "dailyWage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wageDays: { type: "number" } },
  required: ["wageDays"],
} as const;
/** Express supplied guild entry fee as positive daily-wage equivalents on a shared historical currency basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryFee, dailyWage } = request;
  const compute = (): Output => {
    H.domain(entryFee >= 0, "entryFee");
    (H.domain(Number.isFinite(dailyWage) && dailyWage > 0, "dailyWage"),
      dailyWage);
    return { wageDays: entryFee / dailyWage };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryFee: 12, dailyWage: 3 },
  output: { wageDays: 4 },
} satisfies ToolExample<Input, Output>;
export const guildEntryFeeWageDayRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/guild-entry-fee-wage-day-ratio",
    title: "Guild Entry Fee Wage Day Ratio Tool",
    description:
      "Express supplied guild entry fee as positive daily-wage equivalents on a shared historical currency basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryFee: { type: "number", minimum: 0 },
        dailyWage: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["entryFee", "dailyWage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wageDays: { type: "number" } },
      required: ["wageDays"],
    },
    ports: {
      inputs: [
        {
          id: "entryFee",
          label: "Entry Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyWage",
          label: "Daily Wage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wageDays", label: "Wage Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = guildEntryFeeWageDayRatioTool.execute;
export default guildEntryFeeWageDayRatioTool;
