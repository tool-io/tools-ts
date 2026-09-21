import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredSteps: readonly string[];
  readonly completedSteps: readonly string[];
};
export type Output = {
  readonly complete: boolean;
  readonly missingSteps: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredSteps: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    completedSteps: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredSteps", "completedSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complete: { type: "boolean" },
    missingSteps: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["complete", "missingSteps"],
} as const;
/** Compare explicitly required reflection-cycle tokens without validating a pedagogical model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredSteps, completedSteps } = request;
  const compute = (): Output => {
    return {
      complete: requiredSteps.every((x) => completedSteps.includes(x)),
      missingSteps: [
        ...new Set(requiredSteps.filter((x) => !completedSteps.includes(x))),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredSteps: ["act", "reflect"], completedSteps: ["act"] },
  output: { complete: false, missingSteps: ["reflect"] },
} satisfies ToolExample<Input, Output>;
export const reflectionCycleCompletionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/reflection-cycle-completion-flag",
    title: "Reflection Cycle Completion Flag Tool",
    description:
      "Compare explicitly required reflection-cycle tokens without validating a pedagogical model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        completedSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredSteps", "completedSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        complete: { type: "boolean" },
        missingSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["complete", "missingSteps"],
    },
    ports: {
      inputs: [
        {
          id: "requiredSteps",
          label: "Required Steps",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "completedSteps",
          label: "Completed Steps",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
        {
          id: "missingSteps",
          label: "Missing Steps",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = reflectionCycleCompletionFlagTool.execute;
export default reflectionCycleCompletionFlagTool;
