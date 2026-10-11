import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceFee: number;
  readonly targetCurrencyPerSourceCurrency: number;
};
export type Output = { readonly targetFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceFee: { type: "number", minimum: 0 },
    targetCurrencyPerSourceCurrency: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceFee", "targetCurrencyPerSourceCurrency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetFee: { type: "number" } },
  required: ["targetFee"],
} as const;
/** Convert an explicit fee with a supplied target-per-source exchange factor without looking up rates or statutory fees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceFee, targetCurrencyPerSourceCurrency } = request;
  const compute = (): Output => {
    H.domain(sourceFee >= 0, "sourceFee");
    (H.domain(
      targetCurrencyPerSourceCurrency > 0,
      "targetCurrencyPerSourceCurrency",
    ),
      targetCurrencyPerSourceCurrency);
    return { targetFee: sourceFee * targetCurrencyPerSourceCurrency };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceFee: 120, targetCurrencyPerSourceCurrency: 1.25 },
  output: { targetFee: 150 },
} satisfies ToolExample<Input, Output>;
export const regulatoryFeeExchangeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/regulatory-fee-exchange-factor",
    title: "Regulatory Fee Exchange Factor",
    description:
      "Convert an explicit fee with a supplied target-per-source exchange factor without looking up rates or statutory fees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceFee: { type: "number", minimum: 0 },
        targetCurrencyPerSourceCurrency: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["sourceFee", "targetCurrencyPerSourceCurrency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetFee: { type: "number" } },
      required: ["targetFee"],
    },
    ports: {
      inputs: [
        {
          id: "sourceFee",
          label: "Source Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetCurrencyPerSourceCurrency",
          label: "Target Currency Per Source Currency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "targetFee", label: "Target Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = regulatoryFeeExchangeFactorTool.execute;
export default regulatoryFeeExchangeFactorTool;
