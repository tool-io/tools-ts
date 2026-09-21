import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly yieldPerArea: number;
  readonly price: number;
};
export type Output = {
  readonly revenue: number;
  readonly priceDerivative: number;
  readonly yieldDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    yieldPerArea: { type: "number", minimum: 0 },
    price: { type: "number", minimum: 0 },
  },
  required: ["area", "yieldPerArea", "price"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revenue: { type: "number" },
    priceDerivative: { type: "number" },
    yieldDerivative: { type: "number" },
  },
  required: ["revenue", "priceDerivative", "yieldDerivative"],
} as const;
/** Calculate crop yield price one sensitivity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, yieldPerArea, price } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && yieldPerArea >= 0 && price >= 0);
    return {
      revenue: area * yieldPerArea * price,
      priceDerivative: area * yieldPerArea,
      yieldDerivative: area * price,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10, yieldPerArea: 4, price: 200 },
  output: { revenue: 8000, priceDerivative: 40, yieldDerivative: 2000 },
} satisfies ToolExample<Input, Output>;
export const cropYieldPriceOneSensitivityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-yield-price-one-sensitivity-term",
    title: "Crop Yield Price One Sensitivity Term Tool",
    description:
      "Calculate crop yield price one sensitivity term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        yieldPerArea: { type: "number", minimum: 0 },
        price: { type: "number", minimum: 0 },
      },
      required: ["area", "yieldPerArea", "price"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revenue: { type: "number" },
        priceDerivative: { type: "number" },
        yieldDerivative: { type: "number" },
      },
      required: ["revenue", "priceDerivative", "yieldDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yieldPerArea",
          label: "Yield Per Area",
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
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
        {
          id: "priceDerivative",
          label: "Price Derivative",
          valueType: { type: "number" },
        },
        {
          id: "yieldDerivative",
          label: "Yield Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropYieldPriceOneSensitivityTermTool.execute;
export default cropYieldPriceOneSensitivityTermTool;
