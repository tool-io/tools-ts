import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monthlyRent: number;
  readonly termMonths: number;
  readonly freeMonths: number;
};
export type Output = {
  readonly totalRent: number;
  readonly effectiveMonthlyRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monthlyRent: { type: "number", minimum: 0 },
    termMonths: { type: "integer", minimum: 1 },
    freeMonths: { type: "integer", minimum: 0 },
  },
  required: ["monthlyRent", "termMonths", "freeMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRent: { type: "number" },
    effectiveMonthlyRent: { type: "number" },
  },
  required: ["totalRent", "effectiveMonthlyRent"],
} as const;
/** Calculate lease free rent effective month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monthlyRent, termMonths, freeMonths } = request;
  const compute = (): Output => {
    H.domain(monthlyRent >= 0);
    H.integer(termMonths, 1);
    H.integer(freeMonths, 0, termMonths);
    return {
      totalRent: monthlyRent * (termMonths - freeMonths),
      effectiveMonthlyRent:
        (monthlyRent * (termMonths - freeMonths)) / termMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { monthlyRent: 1000, termMonths: 12, freeMonths: 2 },
  output: { totalRent: 10000, effectiveMonthlyRent: 833.3333333333334 },
} satisfies ToolExample<Input, Output>;
export const leaseFreeRentEffectiveMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/lease-free-rent-effective-month-term",
    title: "Lease Free Rent Effective Month Term Tool",
    description:
      "Calculate lease free rent effective month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monthlyRent: { type: "number", minimum: 0 },
        termMonths: { type: "integer", minimum: 1 },
        freeMonths: { type: "integer", minimum: 0 },
      },
      required: ["monthlyRent", "termMonths", "freeMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRent: { type: "number" },
        effectiveMonthlyRent: { type: "number" },
      },
      required: ["totalRent", "effectiveMonthlyRent"],
    },
    ports: {
      inputs: [
        {
          id: "monthlyRent",
          label: "Monthly Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "termMonths",
          label: "Term Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "freeMonths",
          label: "Free Months",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "totalRent", label: "Total Rent", valueType: { type: "number" } },
        {
          id: "effectiveMonthlyRent",
          label: "Effective Monthly Rent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leaseFreeRentEffectiveMonthTermTool.execute;
export default leaseFreeRentEffectiveMonthTermTool;
