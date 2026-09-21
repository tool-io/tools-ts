import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly soldQuantity: number;
  readonly ownQuantity: number;
  readonly salePrice: number;
  readonly imputedOwnPrice: number;
};
export type Output = {
  readonly cashValue: number;
  readonly imputedValue: number;
  readonly totalValue: number;
  readonly ownValueShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soldQuantity: { type: "number", minimum: 0 },
    ownQuantity: { type: "number", minimum: 0 },
    salePrice: { type: "number", minimum: 0 },
    imputedOwnPrice: { type: "number", minimum: 0 },
  },
  required: ["soldQuantity", "ownQuantity", "salePrice", "imputedOwnPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashValue: { type: "number" },
    imputedValue: { type: "number" },
    totalValue: { type: "number" },
    ownValueShare: { type: "number" },
  },
  required: ["cashValue", "imputedValue", "totalValue", "ownValueShare"],
} as const;
/** Calculate farm output value own consumption share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { soldQuantity, ownQuantity, salePrice, imputedOwnPrice } = request;
  const compute = (): Output => {
    H.domain(
      soldQuantity >= 0 &&
        ownQuantity >= 0 &&
        salePrice >= 0 &&
        imputedOwnPrice >= 0 &&
        soldQuantity * salePrice + ownQuantity * imputedOwnPrice > 0,
    );
    return {
      cashValue: soldQuantity * salePrice,
      imputedValue: ownQuantity * imputedOwnPrice,
      totalValue: soldQuantity * salePrice + ownQuantity * imputedOwnPrice,
      ownValueShare:
        (ownQuantity * imputedOwnPrice) /
        (soldQuantity * salePrice + ownQuantity * imputedOwnPrice),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    soldQuantity: 80,
    ownQuantity: 20,
    salePrice: 2,
    imputedOwnPrice: 2,
  },
  output: {
    cashValue: 160,
    imputedValue: 40,
    totalValue: 200,
    ownValueShare: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const farmOutputValueOwnConsumptionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-output-value-own-consumption-share",
    title: "Farm Output Value Own Consumption Share Tool",
    description:
      "Calculate farm output value own consumption share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soldQuantity: { type: "number", minimum: 0 },
        ownQuantity: { type: "number", minimum: 0 },
        salePrice: { type: "number", minimum: 0 },
        imputedOwnPrice: { type: "number", minimum: 0 },
      },
      required: ["soldQuantity", "ownQuantity", "salePrice", "imputedOwnPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashValue: { type: "number" },
        imputedValue: { type: "number" },
        totalValue: { type: "number" },
        ownValueShare: { type: "number" },
      },
      required: ["cashValue", "imputedValue", "totalValue", "ownValueShare"],
    },
    ports: {
      inputs: [
        {
          id: "soldQuantity",
          label: "Sold Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ownQuantity",
          label: "Own Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "salePrice",
          label: "Sale Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imputedOwnPrice",
          label: "Imputed Own Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cashValue", label: "Cash Value", valueType: { type: "number" } },
        {
          id: "imputedValue",
          label: "Imputed Value",
          valueType: { type: "number" },
        },
        {
          id: "totalValue",
          label: "Total Value",
          valueType: { type: "number" },
        },
        {
          id: "ownValueShare",
          label: "Own Value Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmOutputValueOwnConsumptionShareTool.execute;
export default farmOutputValueOwnConsumptionShareTool;
