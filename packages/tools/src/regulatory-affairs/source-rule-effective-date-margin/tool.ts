import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveDate: string;
  readonly evaluationDate: string;
  readonly inclusive: boolean;
};
export type Output = {
  readonly daysSinceEffective: number;
  readonly effectiveUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDate: { type: "string", maxLength: 8192 },
    evaluationDate: { type: "string", maxLength: 8192 },
    inclusive: { type: "boolean" },
  },
  required: ["effectiveDate", "evaluationDate", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysSinceEffective: { type: "integer" },
    effectiveUnderRule: { type: "boolean" },
  },
  required: ["daysSinceEffective", "effectiveUnderRule"],
} as const;
/** Compare supplied public rule dates under an explicit endpoint policy without checking current law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveDate, evaluationDate, inclusive } = request;
  const compute = (): Output => {
    return (() => {
      const daysSinceEffective =
        (H.dateOnly(evaluationDate).getTime() -
          H.dateOnly(effectiveDate).getTime()) /
        86400000;
      return {
        daysSinceEffective,
        effectiveUnderRule: inclusive
          ? daysSinceEffective >= 0
          : daysSinceEffective > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    effectiveDate: "2024-01-01",
    evaluationDate: "2024-01-10",
    inclusive: true,
  },
  output: { daysSinceEffective: 9, effectiveUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const sourceRuleEffectiveDateMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/source-rule-effective-date-margin",
    title: "Source Rule Effective Date Margin Tool",
    description:
      "Compare supplied public rule dates under an explicit endpoint policy without checking current law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDate: { type: "string", maxLength: 8192 },
        evaluationDate: { type: "string", maxLength: 8192 },
        inclusive: { type: "boolean" },
      },
      required: ["effectiveDate", "evaluationDate", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysSinceEffective: { type: "integer" },
        effectiveUnderRule: { type: "boolean" },
      },
      required: ["daysSinceEffective", "effectiveUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveDate",
          label: "Effective Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluationDate",
          label: "Evaluation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "daysSinceEffective",
          label: "Days Since Effective",
          valueType: { type: "integer" },
        },
        {
          id: "effectiveUnderRule",
          label: "Effective Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceRuleEffectiveDateMarginTool.execute;
export default sourceRuleEffectiveDateMarginTool;
