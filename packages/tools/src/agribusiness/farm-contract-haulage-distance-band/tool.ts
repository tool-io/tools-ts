import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly quantity: number;
  readonly rate: number;
};
export type Output = { readonly bandDistance: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    lowerBound: { type: "number", minimum: 0 },
    upperBound: { type: "number" },
    quantity: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
  },
  required: ["distance", "lowerBound", "upperBound", "quantity", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bandDistance: { type: "number" }, charge: { type: "number" } },
  required: ["bandDistance", "charge"],
} as const;
/** Marginal distance-band charge with caller-supplied bounds and a per-quantity-distance rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, lowerBound, upperBound, quantity, rate } = request;
  const compute = (): Output => {
    H.domain(
      distance >= 0 &&
        lowerBound >= 0 &&
        upperBound >= lowerBound &&
        quantity >= 0 &&
        rate >= 0,
    );
    return {
      bandDistance: Math.max(0, Math.min(distance, upperBound) - lowerBound),
      charge:
        Math.max(0, Math.min(distance, upperBound) - lowerBound) *
        quantity *
        rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    distance: 150,
    lowerBound: 100,
    upperBound: 200,
    quantity: 10,
    rate: 2,
  },
  output: { bandDistance: 50, charge: 1000 },
} satisfies ToolExample<Input, Output>;
export const farmContractHaulageDistanceBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-contract-haulage-distance-band",
    title: "Farm Contract Haulage Distance Band Tool",
    description:
      "Marginal distance-band charge with caller-supplied bounds and a per-quantity-distance rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        lowerBound: { type: "number", minimum: 0 },
        upperBound: { type: "number" },
        quantity: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
      },
      required: ["distance", "lowerBound", "upperBound", "quantity", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bandDistance: { type: "number" },
        charge: { type: "number" },
      },
      required: ["bandDistance", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bandDistance",
          label: "Band Distance",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmContractHaulageDistanceBandTool.execute;
export default farmContractHaulageDistanceBandTool;
