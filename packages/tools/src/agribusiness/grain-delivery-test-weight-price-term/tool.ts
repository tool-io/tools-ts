import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly baseUnitPrice: number;
  readonly measuredTestWeight: number;
  readonly referenceTestWeight: number;
  readonly pricePerWeightPoint: number;
};
export type Output = {
  readonly unitAdjustment: number;
  readonly adjustedUnitPrice: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    baseUnitPrice: { type: "number", minimum: 0 },
    measuredTestWeight: { type: "number", minimum: 0 },
    referenceTestWeight: { type: "number", minimum: 0 },
    pricePerWeightPoint: { type: "number", minimum: 0 },
  },
  required: [
    "quantity",
    "baseUnitPrice",
    "measuredTestWeight",
    "referenceTestWeight",
    "pricePerWeightPoint",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitAdjustment: { type: "number" },
    adjustedUnitPrice: { type: "number" },
    total: { type: "number" },
  },
  required: ["unitAdjustment", "adjustedUnitPrice", "total"],
} as const;
/** Linear caller-supplied test-weight pricing adjustment; no commodity grading or discount schedule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    quantity,
    baseUnitPrice,
    measuredTestWeight,
    referenceTestWeight,
    pricePerWeightPoint,
  } = request;
  const compute = (): Output => {
    H.domain(
      quantity >= 0 &&
        baseUnitPrice >= 0 &&
        measuredTestWeight >= 0 &&
        referenceTestWeight >= 0 &&
        pricePerWeightPoint >= 0,
    );
    return {
      unitAdjustment:
        (measuredTestWeight - referenceTestWeight) * pricePerWeightPoint,
      adjustedUnitPrice:
        baseUnitPrice +
        (measuredTestWeight - referenceTestWeight) * pricePerWeightPoint,
      total:
        quantity *
        (baseUnitPrice +
          (measuredTestWeight - referenceTestWeight) * pricePerWeightPoint),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantity: 100,
    baseUnitPrice: 20,
    measuredTestWeight: 78,
    referenceTestWeight: 75,
    pricePerWeightPoint: 0.5,
  },
  output: { unitAdjustment: 1.5, adjustedUnitPrice: 21.5, total: 2150 },
} satisfies ToolExample<Input, Output>;
export const grainDeliveryTestWeightPriceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/grain-delivery-test-weight-price-term",
    title: "Grain Delivery Test Weight Price Term Tool",
    description:
      "Linear caller-supplied test-weight pricing adjustment; no commodity grading or discount schedule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        baseUnitPrice: { type: "number", minimum: 0 },
        measuredTestWeight: { type: "number", minimum: 0 },
        referenceTestWeight: { type: "number", minimum: 0 },
        pricePerWeightPoint: { type: "number", minimum: 0 },
      },
      required: [
        "quantity",
        "baseUnitPrice",
        "measuredTestWeight",
        "referenceTestWeight",
        "pricePerWeightPoint",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitAdjustment: { type: "number" },
        adjustedUnitPrice: { type: "number" },
        total: { type: "number" },
      },
      required: ["unitAdjustment", "adjustedUnitPrice", "total"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseUnitPrice",
          label: "Base Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTestWeight",
          label: "Measured Test Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTestWeight",
          label: "Reference Test Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerWeightPoint",
          label: "Price Per Weight Point",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unitAdjustment",
          label: "Unit Adjustment",
          valueType: { type: "number" },
        },
        {
          id: "adjustedUnitPrice",
          label: "Adjusted Unit Price",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = grainDeliveryTestWeightPriceTermTool.execute;
export default grainDeliveryTestWeightPriceTermTool;
