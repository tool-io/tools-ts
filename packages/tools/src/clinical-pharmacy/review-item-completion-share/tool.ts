import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completed: readonly boolean[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly completedRequired: number;
  readonly requiredCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["completed", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedRequired: { type: "integer" },
    requiredCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["completedRequired", "requiredCount", "share", "defined"],
} as const;
/** Audit explicit review checklist flags without certifying clinical review quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completed, required } = request;
  const compute = (): Output => {
    H.sameLength(completed, required);
    return {
      completedRequired: completed.filter((x, i) => x && required[i]).length,
      requiredCount: required.filter(Boolean).length,
      share: required.some(Boolean)
        ? completed.filter((x, i) => x && required[i]).length /
          required.filter(Boolean).length
        : 0,
      defined: required.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completed: [true, false], required: [true, true] },
  output: { completedRequired: 1, requiredCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const reviewItemCompletionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/review-item-completion-share",
    title: "Review Item Completion Share Tool",
    description:
      "Audit explicit review checklist flags without certifying clinical review quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["completed", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedRequired: { type: "integer" },
        requiredCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["completedRequired", "requiredCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "completedRequired",
          label: "Completed Required",
          valueType: { type: "integer" },
        },
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = reviewItemCompletionShareTool.execute;
export default reviewItemCompletionShareTool;
