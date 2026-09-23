import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly customers: number;
  readonly oldMonthlyPrice: number;
  readonly newMonthlyPrice: number;
  readonly retainedFraction: number;
  readonly migrationCost: number;
};
export type Output = {
  readonly oldMrr: number;
  readonly projectedMrr: number;
  readonly monthlyChange: number;
  readonly firstMonthNetChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    customers: { type: "integer", minimum: 0 },
    oldMonthlyPrice: { type: "number", minimum: 0 },
    newMonthlyPrice: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    migrationCost: { type: "number", minimum: 0 },
  },
  required: [
    "customers",
    "oldMonthlyPrice",
    "newMonthlyPrice",
    "retainedFraction",
    "migrationCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldMrr: { type: "number" },
    projectedMrr: { type: "number" },
    monthlyChange: { type: "number" },
    firstMonthNetChange: { type: "number" },
  },
  required: ["oldMrr", "projectedMrr", "monthlyChange", "firstMonthNetChange"],
} as const;
/** Calculate subscription migration old new price gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    customers,
    oldMonthlyPrice,
    newMonthlyPrice,
    retainedFraction,
    migrationCost,
  } = request;
  const compute = (): Output => {
    H.integer(customers, 0);
    H.domain(
      oldMonthlyPrice >= 0 && newMonthlyPrice >= 0 && migrationCost >= 0,
    );
    H.probability(retainedFraction);
    return {
      oldMrr: customers * oldMonthlyPrice,
      projectedMrr: customers * retainedFraction * newMonthlyPrice,
      monthlyChange:
        customers * (retainedFraction * newMonthlyPrice - oldMonthlyPrice),
      firstMonthNetChange:
        customers * (retainedFraction * newMonthlyPrice - oldMonthlyPrice) -
        migrationCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    customers: 100,
    oldMonthlyPrice: 10,
    newMonthlyPrice: 15,
    retainedFraction: 0.8,
    migrationCost: 100,
  },
  output: {
    oldMrr: 1000,
    projectedMrr: 1200,
    monthlyChange: 200,
    firstMonthNetChange: 100,
  },
} satisfies ToolExample<Input, Output>;
export const subscriptionMigrationOldNewPriceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/subscription-migration-old-new-price-gap",
      title: "Subscription Migration Old New Price Gap Tool",
      description:
        "Calculate subscription migration old new price gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          customers: { type: "integer", minimum: 0 },
          oldMonthlyPrice: { type: "number", minimum: 0 },
          newMonthlyPrice: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
          migrationCost: { type: "number", minimum: 0 },
        },
        required: [
          "customers",
          "oldMonthlyPrice",
          "newMonthlyPrice",
          "retainedFraction",
          "migrationCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldMrr: { type: "number" },
          projectedMrr: { type: "number" },
          monthlyChange: { type: "number" },
          firstMonthNetChange: { type: "number" },
        },
        required: [
          "oldMrr",
          "projectedMrr",
          "monthlyChange",
          "firstMonthNetChange",
        ],
      },
      ports: {
        inputs: [
          {
            id: "customers",
            label: "Customers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "oldMonthlyPrice",
            label: "Old Monthly Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newMonthlyPrice",
            label: "New Monthly Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "migrationCost",
            label: "Migration Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "oldMrr", label: "Old Mrr", valueType: { type: "number" } },
          {
            id: "projectedMrr",
            label: "Projected Mrr",
            valueType: { type: "number" },
          },
          {
            id: "monthlyChange",
            label: "Monthly Change",
            valueType: { type: "number" },
          },
          {
            id: "firstMonthNetChange",
            label: "First Month Net Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = subscriptionMigrationOldNewPriceGapTool.execute;
export default subscriptionMigrationOldNewPriceGapTool;
