import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly borderForeignPrice: number;
  readonly domesticPerForeign: number;
  readonly tariffPerUnit: number;
  readonly transportPerUnit: number;
  readonly distributionMargin: number;
};
export type Output = {
  readonly borderDomestic: number;
  readonly domesticPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borderForeignPrice: { type: "number" },
    domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    tariffPerUnit: { type: "number" },
    transportPerUnit: { type: "number" },
    distributionMargin: { type: "number" },
  },
  required: [
    "borderForeignPrice",
    "domesticPerForeign",
    "tariffPerUnit",
    "transportPerUnit",
    "distributionMargin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borderDomestic: { type: "number" },
    domesticPrice: { type: "number" },
  },
  required: ["borderDomestic", "domesticPrice"],
} as const;
/** Supplied per-unit border-to-domestic price bridge without choosing a tariff, trade margin or equilibrium model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    borderForeignPrice,
    domesticPerForeign,
    tariffPerUnit,
    transportPerUnit,
    distributionMargin,
  } = request;
  const compute = (): Output => {
    H.positive(domesticPerForeign);
    return {
      borderDomestic: borderForeignPrice * domesticPerForeign,
      domesticPrice:
        borderForeignPrice * domesticPerForeign +
        tariffPerUnit +
        transportPerUnit +
        distributionMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    borderForeignPrice: 100,
    domesticPerForeign: 2,
    tariffPerUnit: 10,
    transportPerUnit: 15,
    distributionMargin: 25,
  },
  output: { borderDomestic: 200, domesticPrice: 250 },
} satisfies ToolExample<Input, Output>;
export const borderPriceDomesticMarginBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/border-price-domestic-margin-bridge",
    title: "Border Price Domestic Margin Bridge Tool",
    description:
      "Supplied per-unit border-to-domestic price bridge without choosing a tariff, trade margin or equilibrium model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borderForeignPrice: { type: "number" },
        domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
        tariffPerUnit: { type: "number" },
        transportPerUnit: { type: "number" },
        distributionMargin: { type: "number" },
      },
      required: [
        "borderForeignPrice",
        "domesticPerForeign",
        "tariffPerUnit",
        "transportPerUnit",
        "distributionMargin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borderDomestic: { type: "number" },
        domesticPrice: { type: "number" },
      },
      required: ["borderDomestic", "domesticPrice"],
    },
    ports: {
      inputs: [
        {
          id: "borderForeignPrice",
          label: "Border Foreign Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticPerForeign",
          label: "Domestic Per Foreign",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tariffPerUnit",
          label: "Tariff Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transportPerUnit",
          label: "Transport Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distributionMargin",
          label: "Distribution Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "borderDomestic",
          label: "Border Domestic",
          valueType: { type: "number" },
        },
        {
          id: "domesticPrice",
          label: "Domestic Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = borderPriceDomesticMarginBridgeTool.execute;
export default borderPriceDomesticMarginBridgeTool;
