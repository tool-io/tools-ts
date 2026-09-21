import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yields: readonly number[];
  readonly areas: readonly number[];
  readonly prices: readonly number[];
  readonly referenceRevenue: number;
};
export type Output = {
  readonly totalRevenue: number;
  readonly revenueGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yields: { type: "array", maxItems: 256, items: { type: "number" } },
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    prices: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceRevenue: { type: "number" },
  },
  required: ["yields", "areas", "prices", "referenceRevenue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRevenue: { type: "number" },
    revenueGap: { type: "number" },
  },
  required: ["totalRevenue", "revenueGap"],
} as const;
/** Calculate crop yield price weight gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yields, areas, prices, referenceRevenue } = request;
  const compute = (): Output => {
    H.sameLength(yields, areas);
    H.sameLength(areas, prices);
    H.domain([...yields, ...areas, ...prices].every((x) => x >= 0));
    return (() => {
      const totalRevenue = yields.reduce(
        (s, x, i) => s + x * areas[i] * prices[i],
        0,
      );
      return { totalRevenue, revenueGap: totalRevenue - referenceRevenue };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yields: [2, 3],
    areas: [10, 5],
    prices: [4, 2],
    referenceRevenue: 100,
  },
  output: { totalRevenue: 110, revenueGap: 10 },
} satisfies ToolExample<Input, Output>;
export const cropYieldPriceWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-yield-price-weight-gap",
    title: "Crop Yield Price Weight Gap Tool",
    description:
      "Calculate crop yield price weight gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yields: { type: "array", maxItems: 256, items: { type: "number" } },
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
        prices: { type: "array", maxItems: 256, items: { type: "number" } },
        referenceRevenue: { type: "number" },
      },
      required: ["yields", "areas", "prices", "referenceRevenue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRevenue: { type: "number" },
        revenueGap: { type: "number" },
      },
      required: ["totalRevenue", "revenueGap"],
    },
    ports: {
      inputs: [
        {
          id: "yields",
          label: "Yields",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "prices",
          label: "Prices",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceRevenue",
          label: "Reference Revenue",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalRevenue",
          label: "Total Revenue",
          valueType: { type: "number" },
        },
        {
          id: "revenueGap",
          label: "Revenue Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropYieldPriceWeightGapTool.execute;
export default cropYieldPriceWeightGapTool;
