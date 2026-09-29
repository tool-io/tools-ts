import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goodsValue: number;
  readonly freightCost: number;
  readonly insuranceCost: number;
  readonly freightIncluded: boolean;
  readonly insuranceIncluded: boolean;
  readonly suppliedTaxBase: number;
};
export type Output = { readonly computedTaxBase: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goodsValue: { type: "number", minimum: 0 },
    freightCost: { type: "number", minimum: 0 },
    insuranceCost: { type: "number", minimum: 0 },
    freightIncluded: { type: "boolean" },
    insuranceIncluded: { type: "boolean" },
    suppliedTaxBase: { type: "number", minimum: 0 },
  },
  required: [
    "goodsValue",
    "freightCost",
    "insuranceCost",
    "freightIncluded",
    "insuranceIncluded",
    "suppliedTaxBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { computedTaxBase: { type: "number" }, gap: { type: "number" } },
  required: ["computedTaxBase", "gap"],
} as const;
/** Compare an explicit customs-value inclusion policy with a supplied base; no jurisdictional tax rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    goodsValue,
    freightCost,
    insuranceCost,
    freightIncluded,
    insuranceIncluded,
    suppliedTaxBase,
  } = request;
  const compute = (): Output => {
    H.domain(
      goodsValue >= 0 &&
        freightCost >= 0 &&
        insuranceCost >= 0 &&
        suppliedTaxBase >= 0,
    );
    return (() => {
      const computedTaxBase =
        goodsValue +
        (freightIncluded ? freightCost : 0) +
        (insuranceIncluded ? insuranceCost : 0);
      return { computedTaxBase, gap: suppliedTaxBase - computedTaxBase };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    goodsValue: 100,
    freightCost: 10,
    insuranceCost: 5,
    freightIncluded: true,
    insuranceIncluded: false,
    suppliedTaxBase: 115,
  },
  output: { computedTaxBase: 110, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const freightCostTaxBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/freight-cost-tax-base-gap",
    title: "Freight Cost Tax Base Gap Tool",
    description:
      "Compare an explicit customs-value inclusion policy with a supplied base; no jurisdictional tax rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goodsValue: { type: "number", minimum: 0 },
        freightCost: { type: "number", minimum: 0 },
        insuranceCost: { type: "number", minimum: 0 },
        freightIncluded: { type: "boolean" },
        insuranceIncluded: { type: "boolean" },
        suppliedTaxBase: { type: "number", minimum: 0 },
      },
      required: [
        "goodsValue",
        "freightCost",
        "insuranceCost",
        "freightIncluded",
        "insuranceIncluded",
        "suppliedTaxBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        computedTaxBase: { type: "number" },
        gap: { type: "number" },
      },
      required: ["computedTaxBase", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "goodsValue",
          label: "Goods Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freightCost",
          label: "Freight Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insuranceCost",
          label: "Insurance Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freightIncluded",
          label: "Freight Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "insuranceIncluded",
          label: "Insurance Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedTaxBase",
          label: "Supplied Tax Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "computedTaxBase",
          label: "Computed Tax Base",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = freightCostTaxBaseGapTool.execute;
export default freightCostTaxBaseGapTool;
