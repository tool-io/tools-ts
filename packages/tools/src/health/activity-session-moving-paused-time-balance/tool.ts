import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly elapsed: number; readonly paused: number };
export type Output = {
  readonly moving: number;
  readonly movingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", exclusiveMinimum: 0 },
    paused: { type: "number", minimum: 0 },
  },
  required: ["elapsed", "paused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moving: { type: "number" },
    movingFraction: { type: "number" },
  },
  required: ["moving", "movingFraction"],
} as const;
/** Calculate activity session moving paused time balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, paused } = request;
  const compute = (): Output => {
    H.positive(elapsed);
    H.domain(paused >= 0 && paused <= elapsed);
    const moving = elapsed - paused;
    return { moving, movingFraction: moving / elapsed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 60, paused: 15 },
  output: { moving: 45, movingFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const activitySessionMovingPausedTimeBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/activity-session-moving-paused-time-balance",
      title: "Activity Session Moving Paused Time Balance Tool",
      description:
        "Calculate activity session moving paused time balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "number", exclusiveMinimum: 0 },
          paused: { type: "number", minimum: 0 },
        },
        required: ["elapsed", "paused"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moving: { type: "number" },
          movingFraction: { type: "number" },
        },
        required: ["moving", "movingFraction"],
      },
      ports: {
        inputs: [
          {
            id: "elapsed",
            label: "Elapsed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paused",
            label: "Paused",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "moving", label: "Moving", valueType: { type: "number" } },
          {
            id: "movingFraction",
            label: "Moving Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = activitySessionMovingPausedTimeBalanceTool.execute;
export default activitySessionMovingPausedTimeBalanceTool;
