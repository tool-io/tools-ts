import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCreditHours: number;
  readonly earnedHours: number;
  readonly redeemedHours: number;
};
export type Output = { readonly closingCreditHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCreditHours: { type: "number", minimum: 0 },
    earnedHours: { type: "number", minimum: 0 },
    redeemedHours: { type: "number", minimum: 0 },
  },
  required: ["openingCreditHours", "earnedHours", "redeemedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingCreditHours: { type: "number" } },
  required: ["closingCreditHours"],
} as const;
/** Balance one explicitly recorded volunteer time-credit transaction without assigning a monetary value or verifying eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCreditHours, earnedHours, redeemedHours } = request;
  const compute = (): Output => {
    H.domain(
      openingCreditHours >= 0 &&
        earnedHours >= 0 &&
        redeemedHours >= 0 &&
        redeemedHours <= openingCreditHours + earnedHours,
      "openingCreditHours",
    );
    return {
      closingCreditHours: openingCreditHours + earnedHours - redeemedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCreditHours: 10, earnedHours: 4, redeemedHours: 3 },
  output: { closingCreditHours: 11 },
} satisfies ToolExample<Input, Output>;
export const volunteerHourCreditTransactionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/volunteer-hour-credit-transaction",
    title: "Volunteer Hour Credit Transaction",
    description:
      "Balance one explicitly recorded volunteer time-credit transaction without assigning a monetary value or verifying eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCreditHours: { type: "number", minimum: 0 },
        earnedHours: { type: "number", minimum: 0 },
        redeemedHours: { type: "number", minimum: 0 },
      },
      required: ["openingCreditHours", "earnedHours", "redeemedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingCreditHours: { type: "number" } },
      required: ["closingCreditHours"],
    },
    ports: {
      inputs: [
        {
          id: "openingCreditHours",
          label: "Opening Credit Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earnedHours",
          label: "Earned Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redeemedHours",
          label: "Redeemed Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingCreditHours",
          label: "Closing Credit Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerHourCreditTransactionTool.execute;
export default volunteerHourCreditTransactionTool;
