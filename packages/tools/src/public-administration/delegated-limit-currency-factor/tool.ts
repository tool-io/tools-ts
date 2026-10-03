import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly targetPerSource: number;
};
export type Output = { readonly convertedLimit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number", minimum: 0 },
    targetPerSource: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["limit", "targetPerSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedLimit: { type: "number" } },
  required: ["convertedLimit"],
} as const;
/** Convert a supplied delegation limit with an explicit exchange factor; no live rate or authority rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, targetPerSource } = request;
  const compute = (): Output => {
    H.domain(limit >= 0);
    H.positive(targetPerSource);
    return { convertedLimit: limit * targetPerSource };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 1000, targetPerSource: 0.8 },
  output: { convertedLimit: 800 },
} satisfies ToolExample<Input, Output>;
export const delegatedLimitCurrencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/delegated-limit-currency-factor",
    title: "Delegated Limit Currency Factor Tool",
    description:
      "Convert a supplied delegation limit with an explicit exchange factor; no live rate or authority rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number", minimum: 0 },
        targetPerSource: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["limit", "targetPerSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedLimit: { type: "number" } },
      required: ["convertedLimit"],
    },
    ports: {
      inputs: [
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPerSource",
          label: "Target Per Source",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedLimit",
          label: "Converted Limit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedLimitCurrencyFactorTool.execute;
export default delegatedLimitCurrencyFactorTool;
