import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foreignPrices: readonly number[];
  readonly quantities: readonly number[];
  readonly localPerForeign: number;
  readonly localFees: number;
};
export type Output = {
  readonly foreignCost: number;
  readonly localCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignPrices: { type: "array", maxItems: 256, items: { type: "number" } },
    quantities: { type: "array", maxItems: 256, items: { type: "number" } },
    localPerForeign: { type: "number", exclusiveMinimum: 0 },
    localFees: { type: "number", minimum: 0 },
  },
  required: ["foreignPrices", "quantities", "localPerForeign", "localFees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignCost: { type: "number" },
    localCost: { type: "number" },
  },
  required: ["foreignCost", "localCost"],
} as const;
/** Calculate market basket local currency exchange term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { foreignPrices, quantities, localPerForeign, localFees } = request;
  const compute = (): Output => {
    H.sameLength(foreignPrices, quantities);
    H.domain(
      foreignPrices.every((x) => x >= 0) &&
        quantities.every((x) => x >= 0) &&
        localFees >= 0,
    );
    H.positive(localPerForeign);
    return {
      foreignCost: H.dot(foreignPrices, quantities),
      localCost: H.dot(foreignPrices, quantities) * localPerForeign + localFees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    foreignPrices: [10, 20],
    quantities: [2, 3],
    localPerForeign: 2,
    localFees: 5,
  },
  output: { foreignCost: 80, localCost: 165 },
} satisfies ToolExample<Input, Output>;
export const marketBasketLocalCurrencyExchangeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/market-basket-local-currency-exchange-term",
      title: "Market Basket Local Currency Exchange Term Tool",
      description:
        "Calculate market basket local currency exchange term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          foreignPrices: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          quantities: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          localPerForeign: { type: "number", exclusiveMinimum: 0 },
          localFees: { type: "number", minimum: 0 },
        },
        required: [
          "foreignPrices",
          "quantities",
          "localPerForeign",
          "localFees",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          foreignCost: { type: "number" },
          localCost: { type: "number" },
        },
        required: ["foreignCost", "localCost"],
      },
      ports: {
        inputs: [
          {
            id: "foreignPrices",
            label: "Foreign Prices",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "quantities",
            label: "Quantities",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "localPerForeign",
            label: "Local Per Foreign",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "localFees",
            label: "Local Fees",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "foreignCost",
            label: "Foreign Cost",
            valueType: { type: "number" },
          },
          {
            id: "localCost",
            label: "Local Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = marketBasketLocalCurrencyExchangeTermTool.execute;
export default marketBasketLocalCurrencyExchangeTermTool;
