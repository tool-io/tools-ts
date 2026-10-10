import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currencyWeight: number;
  readonly signedCurrencyReturn: number;
};
export type Output = { readonly returnContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currencyWeight: { type: "number", minimum: 0, maximum: 1 },
    signedCurrencyReturn: { type: "number" },
  },
  required: ["currencyWeight", "signedCurrencyReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { returnContribution: { type: "number" } },
  required: ["returnContribution"],
} as const;
/** Return one explicit linear FX basket weight-times-return contribution without choosing basket constituents or FX quote direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currencyWeight, signedCurrencyReturn } = request;
  const compute = (): Output => {
    (H.domain(currencyWeight >= 0 && currencyWeight <= 1, "currencyWeight"),
      currencyWeight);
    return { returnContribution: currencyWeight * signedCurrencyReturn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currencyWeight: 0.25, signedCurrencyReturn: 0.04 },
  output: { returnContribution: 0.01 },
} satisfies ToolExample<Input, Output>;
export const fxBasketCurrencyWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/fx-basket-currency-weight",
    title: "FX Basket Currency Weight",
    description:
      "Return one explicit linear FX basket weight-times-return contribution without choosing basket constituents or FX quote direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currencyWeight: { type: "number", minimum: 0, maximum: 1 },
        signedCurrencyReturn: { type: "number" },
      },
      required: ["currencyWeight", "signedCurrencyReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { returnContribution: { type: "number" } },
      required: ["returnContribution"],
    },
    ports: {
      inputs: [
        {
          id: "currencyWeight",
          label: "Currency Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedCurrencyReturn",
          label: "Signed Currency Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "returnContribution",
          label: "Return Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fxBasketCurrencyWeightTool.execute;
export default fxBasketCurrencyWeightTool;
