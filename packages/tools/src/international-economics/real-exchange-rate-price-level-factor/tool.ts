import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalDomesticPerForeign: number;
  readonly foreignPrice: number;
  readonly domesticPrice: number;
};
export type Output = { readonly realRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    foreignPrice: { type: "number", exclusiveMinimum: 0 },
    domesticPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominalDomesticPerForeign", "foreignPrice", "domesticPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realRate: { type: "number" } },
  required: ["realRate"],
} as const;
/** Real exchange rate q=E*Pforeign/Pdomestic under a domestic-per-foreign nominal quote convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalDomesticPerForeign, foreignPrice, domesticPrice } = request;
  const compute = (): Output => {
    H.positive(nominalDomesticPerForeign);
    H.positive(foreignPrice);
    H.positive(domesticPrice);
    return {
      realRate: (nominalDomesticPerForeign * foreignPrice) / domesticPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalDomesticPerForeign: 2,
    foreignPrice: 100,
    domesticPrice: 150,
  },
  output: { realRate: 1.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const realExchangeRatePriceLevelFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/real-exchange-rate-price-level-factor",
    title: "Real Exchange Rate Price Level Factor Tool",
    description:
      "Real exchange rate q=E*Pforeign/Pdomestic under a domestic-per-foreign nominal quote convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
        foreignPrice: { type: "number", exclusiveMinimum: 0 },
        domesticPrice: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["nominalDomesticPerForeign", "foreignPrice", "domesticPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { realRate: { type: "number" } },
      required: ["realRate"],
    },
    ports: {
      inputs: [
        {
          id: "nominalDomesticPerForeign",
          label: "Nominal Domestic Per Foreign",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foreignPrice",
          label: "Foreign Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticPrice",
          label: "Domestic Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "realRate", label: "Real Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = realExchangeRatePriceLevelFactorTool.execute;
export default realExchangeRatePriceLevelFactorTool;
