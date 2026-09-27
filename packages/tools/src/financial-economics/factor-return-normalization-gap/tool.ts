import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly factorReturn: number;
  readonly factorScale: number;
  readonly referenceNormalizedReturn: number;
};
export type Output = {
  readonly normalizedReturn: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factorReturn: { type: "number" },
    factorScale: { type: "number", exclusiveMinimum: 0 },
    referenceNormalizedReturn: { type: "number" },
  },
  required: ["factorReturn", "factorScale", "referenceNormalizedReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedReturn: { type: "number" }, gap: { type: "number" } },
  required: ["normalizedReturn", "gap"],
} as const;
/** Compare a supplied factor return normalized by an explicit scale; no return series or risk parameters are estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { factorReturn, factorScale, referenceNormalizedReturn } = request;
  const compute = (): Output => {
    H.positive(factorScale);
    return {
      normalizedReturn: factorReturn / factorScale,
      gap: factorReturn / factorScale - referenceNormalizedReturn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    factorReturn: 0.06,
    factorScale: 0.02,
    referenceNormalizedReturn: 2,
  },
  output: { normalizedReturn: 3, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const factorReturnNormalizationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/factor-return-normalization-gap",
    title: "Factor Return Normalization Gap Tool",
    description:
      "Compare a supplied factor return normalized by an explicit scale; no return series or risk parameters are estimated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factorReturn: { type: "number" },
        factorScale: { type: "number", exclusiveMinimum: 0 },
        referenceNormalizedReturn: { type: "number" },
      },
      required: ["factorReturn", "factorScale", "referenceNormalizedReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedReturn: { type: "number" },
        gap: { type: "number" },
      },
      required: ["normalizedReturn", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "factorReturn",
          label: "Factor Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "factorScale",
          label: "Factor Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceNormalizedReturn",
          label: "Reference Normalized Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedReturn",
          label: "Normalized Return",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = factorReturnNormalizationGapTool.execute;
export default factorReturnNormalizationGapTool;
