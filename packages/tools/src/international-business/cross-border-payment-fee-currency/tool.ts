import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principalSourceCurrency: number;
  readonly sourceCurrencyFee: number;
  readonly targetPerSource: number;
  readonly targetCurrencyFee: number;
};
export type Output = {
  readonly recipientTargetAmount: number;
  readonly convertedGross: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principalSourceCurrency: { type: "number", minimum: 0 },
    sourceCurrencyFee: { type: "number", minimum: 0 },
    targetPerSource: { type: "number", exclusiveMinimum: 0 },
    targetCurrencyFee: { type: "number", minimum: 0 },
  },
  required: [
    "principalSourceCurrency",
    "sourceCurrencyFee",
    "targetPerSource",
    "targetCurrencyFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipientTargetAmount: { type: "number" },
    convertedGross: { type: "number" },
  },
  required: ["recipientTargetAmount", "convertedGross"],
} as const;
/** Apply explicit source- and target-currency payment fees around a supplied FX conversion, retaining a signed net amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    principalSourceCurrency,
    sourceCurrencyFee,
    targetPerSource,
    targetCurrencyFee,
  } = request;
  const compute = (): Output => {
    H.domain(
      principalSourceCurrency >= 0 &&
        sourceCurrencyFee >= 0 &&
        targetCurrencyFee >= 0,
      "principalSourceCurrency",
    );
    (H.domain(targetPerSource > 0, "targetPerSource"), targetPerSource);
    return {
      recipientTargetAmount:
        (principalSourceCurrency - sourceCurrencyFee) * targetPerSource -
        targetCurrencyFee,
      convertedGross: principalSourceCurrency * targetPerSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    principalSourceCurrency: 1000,
    sourceCurrencyFee: 10,
    targetPerSource: 0.8,
    targetCurrencyFee: 5,
  },
  output: { recipientTargetAmount: 787, convertedGross: 800 },
} satisfies ToolExample<Input, Output>;
export const crossBorderPaymentFeeCurrencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/cross-border-payment-fee-currency",
    title: "Cross Border Payment Fee Currency",
    description:
      "Apply explicit source- and target-currency payment fees around a supplied FX conversion, retaining a signed net amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        principalSourceCurrency: { type: "number", minimum: 0 },
        sourceCurrencyFee: { type: "number", minimum: 0 },
        targetPerSource: { type: "number", exclusiveMinimum: 0 },
        targetCurrencyFee: { type: "number", minimum: 0 },
      },
      required: [
        "principalSourceCurrency",
        "sourceCurrencyFee",
        "targetPerSource",
        "targetCurrencyFee",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipientTargetAmount: { type: "number" },
        convertedGross: { type: "number" },
      },
      required: ["recipientTargetAmount", "convertedGross"],
    },
    ports: {
      inputs: [
        {
          id: "principalSourceCurrency",
          label: "Principal Source Currency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceCurrencyFee",
          label: "Source Currency Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPerSource",
          label: "Target Per Source",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetCurrencyFee",
          label: "Target Currency Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recipientTargetAmount",
          label: "Recipient Target Amount",
          valueType: { type: "number" },
        },
        {
          id: "convertedGross",
          label: "Converted Gross",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = crossBorderPaymentFeeCurrencyTool.execute;
export default crossBorderPaymentFeeCurrencyTool;
