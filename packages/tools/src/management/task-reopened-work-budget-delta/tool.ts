import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalBudget: number;
  readonly consumed: number;
  readonly reopenedWork: number;
  readonly remainingAllocation: number;
};
export type Output = {
  readonly requiredRemaining: number;
  readonly allocationGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalBudget: { type: "number", minimum: 0 },
    consumed: { type: "number", minimum: 0 },
    reopenedWork: { type: "number", minimum: 0 },
    remainingAllocation: { type: "number", minimum: 0 },
  },
  required: [
    "originalBudget",
    "consumed",
    "reopenedWork",
    "remainingAllocation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRemaining: { type: "number" },
    allocationGap: { type: "number" },
  },
  required: ["requiredRemaining", "allocationGap"],
} as const;
/** Calculate task reopened work budget delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalBudget, consumed, reopenedWork, remainingAllocation } =
    request;
  const compute = (): Output => {
    H.domain(
      originalBudget >= 0 &&
        consumed >= 0 &&
        reopenedWork >= 0 &&
        remainingAllocation >= 0,
    );
    return {
      requiredRemaining: Math.max(0, originalBudget - consumed) + reopenedWork,
      allocationGap:
        remainingAllocation -
        Math.max(0, originalBudget - consumed) -
        reopenedWork,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalBudget: 100,
    consumed: 80,
    reopenedWork: 30,
    remainingAllocation: 40,
  },
  output: { requiredRemaining: 50, allocationGap: -10 },
} satisfies ToolExample<Input, Output>;
export const taskReopenedWorkBudgetDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-reopened-work-budget-delta",
    title: "Task Reopened Work Budget Delta Tool",
    description:
      "Calculate task reopened work budget delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalBudget: { type: "number", minimum: 0 },
        consumed: { type: "number", minimum: 0 },
        reopenedWork: { type: "number", minimum: 0 },
        remainingAllocation: { type: "number", minimum: 0 },
      },
      required: [
        "originalBudget",
        "consumed",
        "reopenedWork",
        "remainingAllocation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRemaining: { type: "number" },
        allocationGap: { type: "number" },
      },
      required: ["requiredRemaining", "allocationGap"],
    },
    ports: {
      inputs: [
        {
          id: "originalBudget",
          label: "Original Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumed",
          label: "Consumed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reopenedWork",
          label: "Reopened Work",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingAllocation",
          label: "Remaining Allocation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredRemaining",
          label: "Required Remaining",
          valueType: { type: "number" },
        },
        {
          id: "allocationGap",
          label: "Allocation Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskReopenedWorkBudgetDeltaTool.execute;
export default taskReopenedWorkBudgetDeltaTool;
