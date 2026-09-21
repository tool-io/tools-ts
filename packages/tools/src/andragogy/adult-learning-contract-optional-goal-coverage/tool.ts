import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goals: readonly string[];
  readonly completed: readonly string[];
  readonly optional: readonly boolean[];
};
export type Output = {
  readonly requiredCount: number;
  readonly requiredCompleted: number;
  readonly optionalCompleted: number;
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goals: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    completed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    optional: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["goals", "completed", "optional"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    requiredCompleted: { type: "integer" },
    optionalCompleted: { type: "integer" },
    complete: { type: "boolean" },
  },
  required: [
    "requiredCount",
    "requiredCompleted",
    "optionalCompleted",
    "complete",
  ],
} as const;
/** Calculate adult learning contract optional goal coverage from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goals, completed, optional } = request;
  const compute = (): Output => {
    H.sameLength(goals, optional);
    H.domain(new Set(goals).size === goals.length);
    const done = new Set(completed),
      requiredCount = optional.filter((x) => !x).length,
      requiredCompleted = goals.filter(
        (g, i) => !optional[i] && done.has(g),
      ).length,
      optionalCompleted = goals.filter(
        (g, i) => optional[i] && done.has(g),
      ).length;
    return {
      requiredCount,
      requiredCompleted,
      optionalCompleted,
      complete: requiredCompleted === requiredCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    goals: ["A", "B", "C"],
    completed: ["A", "C"],
    optional: [false, false, true],
  },
  output: {
    requiredCount: 2,
    requiredCompleted: 1,
    optionalCompleted: 1,
    complete: false,
  },
} satisfies ToolExample<Input, Output>;
export const adultLearningContractOptionalGoalCoverageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/adult-learning-contract-optional-goal-coverage",
      title: "Adult Learning Contract Optional Goal Coverage Tool",
      description:
        "Calculate adult learning contract optional goal coverage from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          goals: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          completed: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          optional: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["goals", "completed", "optional"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredCount: { type: "integer" },
          requiredCompleted: { type: "integer" },
          optionalCompleted: { type: "integer" },
          complete: { type: "boolean" },
        },
        required: [
          "requiredCount",
          "requiredCompleted",
          "optionalCompleted",
          "complete",
        ],
      },
      ports: {
        inputs: [
          {
            id: "goals",
            label: "Goals",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "completed",
            label: "Completed",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "optional",
            label: "Optional",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "requiredCount",
            label: "Required Count",
            valueType: { type: "integer" },
          },
          {
            id: "requiredCompleted",
            label: "Required Completed",
            valueType: { type: "integer" },
          },
          {
            id: "optionalCompleted",
            label: "Optional Completed",
            valueType: { type: "integer" },
          },
          { id: "complete", label: "Complete", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = adultLearningContractOptionalGoalCoverageTool.execute;
export default adultLearningContractOptionalGoalCoverageTool;
