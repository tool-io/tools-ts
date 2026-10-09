import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spreadBasisPoints: number;
  readonly suppliedSpreadDurationYears: number;
  readonly price: number;
};
export type Output = { readonly linearPriceChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spreadBasisPoints: { type: "number" },
    suppliedSpreadDurationYears: { type: "number" },
    price: { type: "number" },
  },
  required: ["spreadBasisPoints", "suppliedSpreadDurationYears", "price"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linearPriceChange: { type: "number" } },
  required: ["linearPriceChange"],
} as const;
/** Approximate a price increment from explicit basis-point spread change, price, and signed spread-duration sensitivity using the first-order relation minus price times duration times fractional spread change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spreadBasisPoints, suppliedSpreadDurationYears, price } = request;
  const compute = (): Output => {
    return {
      linearPriceChange:
        (-price * suppliedSpreadDurationYears * spreadBasisPoints) / 10000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spreadBasisPoints: 20, suppliedSpreadDurationYears: 5, price: 100 },
  output: { linearPriceChange: -1 },
} satisfies ToolExample<Input, Output>;
export const impliedSpreadPriceIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/implied-spread-price-increment",
    title: "Implied Spread Price Increment",
    description:
      "Approximate a price increment from explicit basis-point spread change, price, and signed spread-duration sensitivity using the first-order relation minus price times duration times fractional spread change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spreadBasisPoints: { type: "number" },
        suppliedSpreadDurationYears: { type: "number" },
        price: { type: "number" },
      },
      required: ["spreadBasisPoints", "suppliedSpreadDurationYears", "price"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linearPriceChange: { type: "number" } },
      required: ["linearPriceChange"],
    },
    ports: {
      inputs: [
        {
          id: "spreadBasisPoints",
          label: "Spread Basis Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSpreadDurationYears",
          label: "Supplied Spread Duration Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearPriceChange",
          label: "Linear Price Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = impliedSpreadPriceIncrementTool.execute;
export default impliedSpreadPriceIncrementTool;
