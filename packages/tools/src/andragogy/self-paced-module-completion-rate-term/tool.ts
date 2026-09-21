import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completed: number;
  readonly total: number;
  readonly activeDays: number;
};
export type Output = {
  readonly completionFraction: number;
  readonly modulesPerDay: number;
  readonly projectedRemainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: { type: "integer", minimum: 1 },
    total: { type: "integer", minimum: 1 },
    activeDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["completed", "total", "activeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completionFraction: { type: "number" },
    modulesPerDay: { type: "number" },
    projectedRemainingDays: { type: "number" },
  },
  required: ["completionFraction", "modulesPerDay", "projectedRemainingDays"],
} as const;
/** Constant observed pace extrapolation with no learning-performance prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completed, total, activeDays } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(completed, 1, total);
    H.positive(activeDays);
    return {
      completionFraction: completed / total,
      modulesPerDay: completed / activeDays,
      projectedRemainingDays: ((total - completed) * activeDays) / completed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completed: 6, total: 10, activeDays: 12 },
  output: {
    completionFraction: 0.6,
    modulesPerDay: 0.5,
    projectedRemainingDays: 8,
  },
} satisfies ToolExample<Input, Output>;
export const selfPacedModuleCompletionRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/self-paced-module-completion-rate-term",
    title: "Self Paced Module Completion Rate Term Tool",
    description:
      "Constant observed pace extrapolation with no learning-performance prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completed: { type: "integer", minimum: 1 },
        total: { type: "integer", minimum: 1 },
        activeDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["completed", "total", "activeDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completionFraction: { type: "number" },
        modulesPerDay: { type: "number" },
        projectedRemainingDays: { type: "number" },
      },
      required: [
        "completionFraction",
        "modulesPerDay",
        "projectedRemainingDays",
      ],
    },
    ports: {
      inputs: [
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "activeDays",
          label: "Active Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "completionFraction",
          label: "Completion Fraction",
          valueType: { type: "number" },
        },
        {
          id: "modulesPerDay",
          label: "Modules Per Day",
          valueType: { type: "number" },
        },
        {
          id: "projectedRemainingDays",
          label: "Projected Remaining Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfPacedModuleCompletionRateTermTool.execute;
export default selfPacedModuleCompletionRateTermTool;
