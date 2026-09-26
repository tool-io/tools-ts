import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxBase: number;
  readonly rate: number;
  readonly administrationCost: number;
  readonly recyclingFraction: number;
  readonly households: number;
};
export type Output = {
  readonly grossRevenue: number;
  readonly recycled: number;
  readonly perHousehold: number;
  readonly retained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxBase: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    administrationCost: { type: "number", minimum: 0 },
    recyclingFraction: { type: "number", minimum: 0, maximum: 1 },
    households: { type: "integer", minimum: 1 },
  },
  required: [
    "taxBase",
    "rate",
    "administrationCost",
    "recyclingFraction",
    "households",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRevenue: { type: "number" },
    recycled: { type: "number" },
    perHousehold: { type: "number" },
    retained: { type: "number" },
  },
  required: ["grossRevenue", "recycled", "perHousehold", "retained"],
} as const;
/** Calculate environmental tax revenue recycling share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxBase, rate, administrationCost, recyclingFraction, households } =
    request;
  const compute = (): Output => {
    H.domain(taxBase >= 0 && rate >= 0 && administrationCost >= 0);
    H.probability(recyclingFraction);
    H.integer(households, 1);
    return {
      grossRevenue: taxBase * rate,
      recycled: (taxBase * rate - administrationCost) * recyclingFraction,
      perHousehold:
        ((taxBase * rate - administrationCost) * recyclingFraction) /
        households,
      retained: (taxBase * rate - administrationCost) * (1 - recyclingFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taxBase: 100000,
    rate: 0.1,
    administrationCost: 1000,
    recyclingFraction: 0.6,
    households: 100,
  },
  output: {
    grossRevenue: 10000,
    recycled: 5400,
    perHousehold: 54,
    retained: 3600,
  },
} satisfies ToolExample<Input, Output>;
export const environmentalTaxRevenueRecyclingShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/environmental-tax-revenue-recycling-share",
      title: "Environmental Tax Revenue Recycling Share Tool",
      description:
        "Calculate environmental tax revenue recycling share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          taxBase: { type: "number", minimum: 0 },
          rate: { type: "number", minimum: 0 },
          administrationCost: { type: "number", minimum: 0 },
          recyclingFraction: { type: "number", minimum: 0, maximum: 1 },
          households: { type: "integer", minimum: 1 },
        },
        required: [
          "taxBase",
          "rate",
          "administrationCost",
          "recyclingFraction",
          "households",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossRevenue: { type: "number" },
          recycled: { type: "number" },
          perHousehold: { type: "number" },
          retained: { type: "number" },
        },
        required: ["grossRevenue", "recycled", "perHousehold", "retained"],
      },
      ports: {
        inputs: [
          {
            id: "taxBase",
            label: "Tax Base",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rate",
            label: "Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "administrationCost",
            label: "Administration Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recyclingFraction",
            label: "Recycling Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "households",
            label: "Households",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "grossRevenue",
            label: "Gross Revenue",
            valueType: { type: "number" },
          },
          { id: "recycled", label: "Recycled", valueType: { type: "number" } },
          {
            id: "perHousehold",
            label: "Per Household",
            valueType: { type: "number" },
          },
          { id: "retained", label: "Retained", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = environmentalTaxRevenueRecyclingShareTool.execute;
export default environmentalTaxRevenueRecyclingShareTool;
