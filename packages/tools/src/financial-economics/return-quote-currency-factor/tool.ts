import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assetGrossReturn: number;
  readonly fxGrossReturn: number;
};
export type Output = {
  readonly convertedGrossReturn: number;
  readonly simpleReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assetGrossReturn: { type: "number", minimum: 0 },
    fxGrossReturn: { type: "number", minimum: 0 },
  },
  required: ["assetGrossReturn", "fxGrossReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedGrossReturn: { type: "number" },
    simpleReturn: { type: "number" },
  },
  required: ["convertedGrossReturn", "simpleReturn"],
} as const;
/** Multiply asset and target-per-source FX gross returns; no live exchange rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assetGrossReturn, fxGrossReturn } = request;
  const compute = (): Output => {
    H.domain(assetGrossReturn >= 0 && fxGrossReturn >= 0);
    return {
      convertedGrossReturn: assetGrossReturn * fxGrossReturn,
      simpleReturn: assetGrossReturn * fxGrossReturn - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assetGrossReturn: 1.1, fxGrossReturn: 0.9 },
  output: {
    convertedGrossReturn: 0.9900000000000001,
    simpleReturn: -0.009999999999999898,
  },
} satisfies ToolExample<Input, Output>;
export const returnQuoteCurrencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/return-quote-currency-factor",
    title: "Return Quote Currency Factor Tool",
    description:
      "Multiply asset and target-per-source FX gross returns; no live exchange rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assetGrossReturn: { type: "number", minimum: 0 },
        fxGrossReturn: { type: "number", minimum: 0 },
      },
      required: ["assetGrossReturn", "fxGrossReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedGrossReturn: { type: "number" },
        simpleReturn: { type: "number" },
      },
      required: ["convertedGrossReturn", "simpleReturn"],
    },
    ports: {
      inputs: [
        {
          id: "assetGrossReturn",
          label: "Asset Gross Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fxGrossReturn",
          label: "Fx Gross Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedGrossReturn",
          label: "Converted Gross Return",
          valueType: { type: "number" },
        },
        {
          id: "simpleReturn",
          label: "Simple Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = returnQuoteCurrencyFactorTool.execute;
export default returnQuoteCurrencyFactorTool;
