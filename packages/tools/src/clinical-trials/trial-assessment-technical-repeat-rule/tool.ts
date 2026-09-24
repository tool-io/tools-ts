import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly eligible: readonly boolean[];
  readonly rule: string;
};
export type Output = {
  readonly includedCount: number;
  readonly result: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    rule: {
      type: "string",
      maxLength: 8192,
      enum: ["mean", "median", "first"],
    },
  },
  required: ["values", "eligible", "rule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCount: { type: "integer" },
    result: { type: "number" },
  },
  required: ["includedCount", "result"],
} as const;
/** Aggregate explicitly eligible technical repeats under a supplied rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, eligible, rule } = request;
  const compute = (): Output => {
    H.sameLength(values, eligible);
    H.domain(["mean", "median", "first"].includes(rule), "rule");
    const selected = values.filter((_, i) => eligible[i]);
    H.domain(selected.length > 0, "eligible");
    const sorted = [...selected].sort((a, b) => a - b),
      mid = Math.floor(sorted.length / 2);
    return {
      includedCount: selected.length,
      result:
        rule === "first"
          ? selected[0]
          : rule === "mean"
            ? selected.reduce((a, b) => a + b / selected.length, 0)
            : sorted.length % 2
              ? sorted[mid]
              : (sorted[mid - 1] + sorted[mid]) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [4, 8, 100], eligible: [true, true, false], rule: "mean" },
  output: { includedCount: 2, result: 6 },
} satisfies ToolExample<Input, Output>;
export const trialAssessmentTechnicalRepeatRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-assessment-technical-repeat-rule",
    title: "Trial Assessment Technical Repeat Rule Tool",
    description:
      "Aggregate explicitly eligible technical repeats under a supplied rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        rule: {
          type: "string",
          maxLength: 8192,
          enum: ["mean", "median", "first"],
        },
      },
      required: ["values", "eligible", "rule"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedCount: { type: "integer" },
        result: { type: "number" },
      },
      required: ["includedCount", "result"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "rule",
          label: "Rule",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        { id: "result", label: "Result", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = trialAssessmentTechnicalRepeatRuleTool.execute;
export default trialAssessmentTechnicalRepeatRuleTool;
