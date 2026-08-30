import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalWorkflowSteps: number;
  readonly autonomousSteps: number;
  readonly humanApprovalSteps: number;
  readonly humanInterventionEvents: number;
}>;
export type Output = Readonly<{
  readonly autonomousStepPercent: number;
  readonly approvalStepPercent: number;
  readonly interventionsPerStep: number;
  readonly autonomyLevel: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.autonomousSteps > input.totalWorkflowSteps ||
    input.humanApprovalSteps > input.totalWorkflowSteps
  )
    simpleError(
      "autonomousSteps",
      "Step counts cannot exceed total steps.",
      "invalid_counts",
    );
  const autonomousStepPercent =
      (input.autonomousSteps / input.totalWorkflowSteps) * 100,
    approvalStepPercent =
      (input.humanApprovalSteps / input.totalWorkflowSteps) * 100,
    interventionsPerStep =
      input.humanInterventionEvents / input.totalWorkflowSteps;
  return {
    autonomousStepPercent,
    approvalStepPercent,
    interventionsPerStep,
    autonomyLevel:
      autonomousStepPercent >= 80 &&
      approvalStepPercent <= 20 &&
      interventionsPerStep <= 0.1
        ? "high-autonomy"
        : autonomousStepPercent >= 40
          ? "supervised"
          : "assisted",
  };
};

export const exampleInput = {
  totalWorkflowSteps: 10,
  autonomousSteps: 8,
  humanApprovalSteps: 2,
  humanInterventionEvents: 1,
} satisfies Input;
export const exampleOutput = {
  autonomousStepPercent: 80,
  approvalStepPercent: 20,
  interventionsPerStep: 0.1,
  autonomyLevel: "high-autonomy",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalWorkflowSteps: input.totalWorkflowSteps as number,
      autonomousSteps: input.autonomousSteps as number,
      humanApprovalSteps: input.humanApprovalSteps as number,
      humanInterventionEvents: input.humanInterventionEvents as number,
    }),
  description:
    "Classify agent-workflow autonomy from step and intervention counts.",
  id: "futurology/agent-workflow-autonomy",
  inputs: [
    {
      id: "totalWorkflowSteps",
      label: "Total workflow steps",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "autonomousSteps",
      label: "Autonomous steps",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "humanApprovalSteps",
      label: "Human approval steps",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "humanInterventionEvents",
      label: "Human intervention events",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "autonomousStepPercent",
      label: "Autonomous step share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "approvalStepPercent",
      label: "Approval step share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "interventionsPerStep",
      label: "Interventions per step",
      kind: "number",
      minimum: 0,
    },
    {
      id: "autonomyLevel",
      label: "Autonomy level",
      kind: "string",
      enum: ["assisted", "supervised", "high-autonomy"],
    },
  ],
  title: "Agent Workflow Autonomy",
});

export const run = tool.execute;
export default tool;
