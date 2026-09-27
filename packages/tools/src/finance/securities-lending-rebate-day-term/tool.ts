import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collateral: number;
  readonly annualRate: number;
  readonly days: number;
  readonly basis: number;
};
export type Output = { readonly rebate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collateral: { type: "number", minimum: 0 },
    annualRate: { type: "number" },
    days: { type: "integer", minimum: 0 },
    basis: { type: "integer", minimum: 1 },
  },
  required: ["collateral", "annualRate", "days", "basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rebate: { type: "number" } },
  required: ["rebate"],
} as const;
/** Calculate securities lending rebate day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collateral, annualRate, days, basis } = request;
  const compute = (): Output => {
    H.domain(collateral >= 0);
    H.integer(days, 0);
    H.integer(basis, 1);
    return { rebate: (collateral * annualRate * days) / basis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collateral: 10000, annualRate: 0.036, days: 10, basis: 360 },
  output: { rebate: 10 },
} satisfies ToolExample<Input, Output>;
export const securitiesLendingRebateDayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/securities-lending-rebate-day-term",
    title: "Securities Lending Rebate Day Term Tool",
    description:
      "Calculate securities lending rebate day term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collateral: { type: "number", minimum: 0 },
        annualRate: { type: "number" },
        days: { type: "integer", minimum: 0 },
        basis: { type: "integer", minimum: 1 },
      },
      required: ["collateral", "annualRate", "days", "basis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rebate: { type: "number" } },
      required: ["rebate"],
    },
    ports: {
      inputs: [
        {
          id: "collateral",
          label: "Collateral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rebate", label: "Rebate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = securitiesLendingRebateDayTermTool.execute;
export default securitiesLendingRebateDayTermTool;
