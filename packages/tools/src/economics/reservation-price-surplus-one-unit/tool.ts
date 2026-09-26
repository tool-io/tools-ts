import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reservationPrice: number;
  readonly actualPrice: number;
};
export type Output = {
  readonly surplus: number;
  readonly participates: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reservationPrice: { type: "number" },
    actualPrice: { type: "number" },
  },
  required: ["reservationPrice", "actualPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surplus: { type: "number" },
    participates: { type: "boolean" },
  },
  required: ["surplus", "participates"],
} as const;
/** Calculate reservation price surplus one unit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reservationPrice, actualPrice } = request;
  const compute = (): Output => {
    return {
      surplus: reservationPrice - actualPrice,
      participates: reservationPrice >= actualPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reservationPrice: 20, actualPrice: 15 },
  output: { surplus: 5, participates: true },
} satisfies ToolExample<Input, Output>;
export const reservationPriceSurplusOneUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/reservation-price-surplus-one-unit",
    title: "Reservation Price Surplus One Unit Tool",
    description:
      "Calculate reservation price surplus one unit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reservationPrice: { type: "number" },
        actualPrice: { type: "number" },
      },
      required: ["reservationPrice", "actualPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surplus: { type: "number" },
        participates: { type: "boolean" },
      },
      required: ["surplus", "participates"],
    },
    ports: {
      inputs: [
        {
          id: "reservationPrice",
          label: "Reservation Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualPrice",
          label: "Actual Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
        {
          id: "participates",
          label: "Participates",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservationPriceSurplusOneUnitTool.execute;
export default reservationPriceSurplusOneUnitTool;
