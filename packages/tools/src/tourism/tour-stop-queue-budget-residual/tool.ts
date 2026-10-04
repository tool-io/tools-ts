import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stopBudget: number;
  readonly presentation: number;
  readonly walking: number;
  readonly queue: number;
};
export type Output = { readonly total: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stopBudget: { type: "number", minimum: 0 },
    presentation: { type: "number", minimum: 0 },
    walking: { type: "number", minimum: 0 },
    queue: { type: "number", minimum: 0 },
  },
  required: ["stopBudget", "presentation", "walking", "queue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { total: { type: "number" }, residual: { type: "number" } },
  required: ["total", "residual"],
} as const;
/** Calculate tour stop queue budget residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stopBudget, presentation, walking, queue } = request;
  const compute = (): Output => {
    H.domain(
      stopBudget >= 0 && presentation >= 0 && walking >= 0 && queue >= 0,
    );
    return {
      total: presentation + walking + queue,
      residual: stopBudget - presentation - walking - queue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stopBudget: 60, presentation: 30, walking: 10, queue: 15 },
  output: { total: 55, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const tourStopQueueBudgetResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/tour-stop-queue-budget-residual",
    title: "Tour Stop Queue Budget Residual Tool",
    description:
      "Calculate tour stop queue budget residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stopBudget: { type: "number", minimum: 0 },
        presentation: { type: "number", minimum: 0 },
        walking: { type: "number", minimum: 0 },
        queue: { type: "number", minimum: 0 },
      },
      required: ["stopBudget", "presentation", "walking", "queue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { total: { type: "number" }, residual: { type: "number" } },
      required: ["total", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "stopBudget",
          label: "Stop Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "presentation",
          label: "Presentation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "walking",
          label: "Walking",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "queue",
          label: "Queue",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tourStopQueueBudgetResidualTool.execute;
export default tourStopQueueBudgetResidualTool;
