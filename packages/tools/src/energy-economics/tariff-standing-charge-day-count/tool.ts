import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly billedDays: number;
  readonly dailyStandingCharge: number;
};
export type Output = { readonly standingCharge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billedDays: { type: "integer", minimum: 0 },
    dailyStandingCharge: { type: "number", minimum: 0 },
  },
  required: ["billedDays", "dailyStandingCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standingCharge: { type: "number" } },
  required: ["standingCharge"],
} as const;
/** Extend an explicitly counted tariff standing charge by a supplied daily rate without inferring billing dates or tax treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { billedDays, dailyStandingCharge } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(billedDays) &&
        billedDays >= 0 &&
        billedDays <= Number.MAX_SAFE_INTEGER,
      "billedDays",
    ),
      billedDays);
    H.domain(dailyStandingCharge >= 0, "dailyStandingCharge");
    return { standingCharge: billedDays * dailyStandingCharge };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { billedDays: 30, dailyStandingCharge: 0.5 },
  output: { standingCharge: 15 },
} satisfies ToolExample<Input, Output>;
export const tariffStandingChargeDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/tariff-standing-charge-day-count",
    title: "Tariff Standing Charge Day Count",
    description:
      "Extend an explicitly counted tariff standing charge by a supplied daily rate without inferring billing dates or tax treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billedDays: { type: "integer", minimum: 0 },
        dailyStandingCharge: { type: "number", minimum: 0 },
      },
      required: ["billedDays", "dailyStandingCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standingCharge: { type: "number" } },
      required: ["standingCharge"],
    },
    ports: {
      inputs: [
        {
          id: "billedDays",
          label: "Billed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dailyStandingCharge",
          label: "Daily Standing Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standingCharge",
          label: "Standing Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tariffStandingChargeDayCountTool.execute;
export default tariffStandingChargeDayCountTool;
