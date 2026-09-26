import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterPrice: number;
  readonly extractionCost: number;
  readonly deliveryCost: number;
  readonly quantity: number;
};
export type Output = {
  readonly rentPerUnit: number;
  readonly totalRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterPrice: { type: "number" },
    extractionCost: { type: "number" },
    deliveryCost: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["waterPrice", "extractionCost", "deliveryCost", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentPerUnit: { type: "number" },
    totalRent: { type: "number" },
  },
  required: ["rentPerUnit", "totalRent"],
} as const;
/** Calculate water scarcity rent one unit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterPrice, extractionCost, deliveryCost, quantity } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return {
      rentPerUnit: waterPrice - extractionCost - deliveryCost,
      totalRent: (waterPrice - extractionCost - deliveryCost) * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waterPrice: 3,
    extractionCost: 0.5,
    deliveryCost: 1,
    quantity: 1000,
  },
  output: { rentPerUnit: 1.5, totalRent: 1500 },
} satisfies ToolExample<Input, Output>;
export const waterScarcityRentOneUnitTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/water-scarcity-rent-one-unit-term",
    title: "Water Scarcity Rent One Unit Term Tool",
    description:
      "Calculate water scarcity rent one unit term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterPrice: { type: "number" },
        extractionCost: { type: "number" },
        deliveryCost: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["waterPrice", "extractionCost", "deliveryCost", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentPerUnit: { type: "number" },
        totalRent: { type: "number" },
      },
      required: ["rentPerUnit", "totalRent"],
    },
    ports: {
      inputs: [
        {
          id: "waterPrice",
          label: "Water Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extractionCost",
          label: "Extraction Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveryCost",
          label: "Delivery Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rentPerUnit",
          label: "Rent Per Unit",
          valueType: { type: "number" },
        },
        { id: "totalRent", label: "Total Rent", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waterScarcityRentOneUnitTermTool.execute;
export default waterScarcityRentOneUnitTermTool;
