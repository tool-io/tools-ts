import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantDay: number;
  readonly rateDay: number;
  readonly allowedLag: number;
};
export type Output = {
  readonly lagDays: number;
  readonly acceptableUnderLag: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantDay: { type: "integer" },
    rateDay: { type: "integer" },
    allowedLag: { type: "integer", minimum: 0 },
  },
  required: ["grantDay", "rateDay", "allowedLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagDays: { type: "integer" },
    acceptableUnderLag: { type: "boolean" },
  },
  required: ["lagDays", "acceptableUnderLag"],
} as const;
/** Calculate aid grant exchange rate date flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantDay, rateDay, allowedLag } = request;
  const compute = (): Output => {
    H.integer(allowedLag, 0);
    return {
      lagDays: grantDay - rateDay,
      acceptableUnderLag:
        rateDay <= grantDay && grantDay - rateDay <= allowedLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grantDay: 100, rateDay: 98, allowedLag: 3 },
  output: { lagDays: 2, acceptableUnderLag: true },
} satisfies ToolExample<Input, Output>;
export const aidGrantExchangeRateDateFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/aid-grant-exchange-rate-date-flag",
    title: "Aid Grant Exchange Rate Date Flag Tool",
    description:
      "Calculate aid grant exchange rate date flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grantDay: { type: "integer" },
        rateDay: { type: "integer" },
        allowedLag: { type: "integer", minimum: 0 },
      },
      required: ["grantDay", "rateDay", "allowedLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagDays: { type: "integer" },
        acceptableUnderLag: { type: "boolean" },
      },
      required: ["lagDays", "acceptableUnderLag"],
    },
    ports: {
      inputs: [
        {
          id: "grantDay",
          label: "Grant Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rateDay",
          label: "Rate Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedLag",
          label: "Allowed Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lagDays", label: "Lag Days", valueType: { type: "integer" } },
        {
          id: "acceptableUnderLag",
          label: "Acceptable Under Lag",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = aidGrantExchangeRateDateFlagTool.execute;
export default aidGrantExchangeRateDateFlagTool;
