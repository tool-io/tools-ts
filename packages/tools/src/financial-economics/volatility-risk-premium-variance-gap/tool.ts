import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impliedVariance: number;
  readonly realizedVariance: number;
};
export type Output = { readonly impliedMinusRealizedVariance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedVariance: { type: "number", minimum: 0 },
    realizedVariance: { type: "number", minimum: 0 },
  },
  required: ["impliedVariance", "realizedVariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { impliedMinusRealizedVariance: { type: "number" } },
  required: ["impliedMinusRealizedVariance"],
} as const;
/** Subtract supplied realized from implied variance on a shared horizon and return basis, distinct from a volatility difference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impliedVariance, realizedVariance } = request;
  const compute = (): Output => {
    H.domain(impliedVariance >= 0, "impliedVariance");
    H.domain(realizedVariance >= 0, "realizedVariance");
    return { impliedMinusRealizedVariance: impliedVariance - realizedVariance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { impliedVariance: 0.04, realizedVariance: 0.03 },
  output: { impliedMinusRealizedVariance: 0.010000000000000002 },
} satisfies ToolExample<Input, Output>;
export const volatilityRiskPremiumVarianceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/volatility-risk-premium-variance-gap",
    title: "Volatility Risk Premium Variance Gap Tool",
    description:
      "Subtract supplied realized from implied variance on a shared horizon and return basis, distinct from a volatility difference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedVariance: { type: "number", minimum: 0 },
        realizedVariance: { type: "number", minimum: 0 },
      },
      required: ["impliedVariance", "realizedVariance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { impliedMinusRealizedVariance: { type: "number" } },
      required: ["impliedMinusRealizedVariance"],
    },
    ports: {
      inputs: [
        {
          id: "impliedVariance",
          label: "Implied Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "realizedVariance",
          label: "Realized Variance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedMinusRealizedVariance",
          label: "Implied Minus Realized Variance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volatilityRiskPremiumVarianceGapTool.execute;
export default volatilityRiskPremiumVarianceGapTool;
