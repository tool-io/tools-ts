import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limitAmount: number;
  readonly currencyCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limitAmount: { type: "number", minimum: 0 },
    currencyCode: { type: "string", maxLength: 8192 },
  },
  required: ["limitAmount", "currencyCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a nonnegative approval limit with a three-uppercase-letter currency-code-shaped token without currency conversion or registry validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limitAmount, currencyCode } = request;
  const compute = (): Output => {
    H.domain(limitAmount >= 0, "limitAmount");
    H.domain(/^[A-Z]{3}(?![\s\S])/.test(currencyCode), "currencyCode");
    return { label: currencyCode + " " + limitAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limitAmount: 10000, currencyCode: "USD" },
  output: { label: "USD 10000" },
} satisfies ToolExample<Input, Output>;
export const approvalLimitCurrencyPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/approval-limit-currency-pair",
    title: "Approval Limit Currency Pair",
    description:
      "Label a nonnegative approval limit with a three-uppercase-letter currency-code-shaped token without currency conversion or registry validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limitAmount: { type: "number", minimum: 0 },
        currencyCode: { type: "string", maxLength: 8192 },
      },
      required: ["limitAmount", "currencyCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "limitAmount",
          label: "Limit Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currencyCode",
          label: "Currency Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = approvalLimitCurrencyPairTool.execute;
export default approvalLimitCurrencyPairTool;
