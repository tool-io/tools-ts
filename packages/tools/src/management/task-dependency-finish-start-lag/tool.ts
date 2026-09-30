import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predecessorFinish: number;
  readonly lag: number;
  readonly successorEarliest: number;
};
export type Output = {
  readonly dependencyStart: number;
  readonly scheduledStart: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predecessorFinish: { type: "number" },
    lag: { type: "number" },
    successorEarliest: { type: "number" },
  },
  required: ["predecessorFinish", "lag", "successorEarliest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dependencyStart: { type: "number" },
    scheduledStart: { type: "number" },
  },
  required: ["dependencyStart", "scheduledStart"],
} as const;
/** Calculate task dependency finish start lag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predecessorFinish, lag, successorEarliest } = request;
  const compute = (): Output => {
    return {
      dependencyStart: predecessorFinish + lag,
      scheduledStart: Math.max(predecessorFinish + lag, successorEarliest),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predecessorFinish: 10, lag: 2, successorEarliest: 11 },
  output: { dependencyStart: 12, scheduledStart: 12 },
} satisfies ToolExample<Input, Output>;
export const taskDependencyFinishStartLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-dependency-finish-start-lag",
    title: "Task Dependency Finish Start Lag Tool",
    description:
      "Calculate task dependency finish start lag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predecessorFinish: { type: "number" },
        lag: { type: "number" },
        successorEarliest: { type: "number" },
      },
      required: ["predecessorFinish", "lag", "successorEarliest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dependencyStart: { type: "number" },
        scheduledStart: { type: "number" },
      },
      required: ["dependencyStart", "scheduledStart"],
    },
    ports: {
      inputs: [
        {
          id: "predecessorFinish",
          label: "Predecessor Finish",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lag",
          label: "Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "successorEarliest",
          label: "Successor Earliest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dependencyStart",
          label: "Dependency Start",
          valueType: { type: "number" },
        },
        {
          id: "scheduledStart",
          label: "Scheduled Start",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskDependencyFinishStartLagTool.execute;
export default taskDependencyFinishStartLagTool;
