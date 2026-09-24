import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneDuration: number;
  readonly actionDurations: readonly number[];
  readonly simultaneousCredit: number;
};
export type Output = {
  readonly accountedDuration: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneDuration: { type: "number", minimum: 0 },
    actionDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    simultaneousCredit: { type: "number", minimum: 0 },
  },
  required: ["sceneDuration", "actionDurations", "simultaneousCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accountedDuration: { type: "number" },
    slack: { type: "number" },
  },
  required: ["accountedDuration", "slack"],
} as const;
/** Calculate scene elapsed time slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneDuration, actionDurations, simultaneousCredit } = request;
  const compute = (): Output => {
    H.domain(
      sceneDuration >= 0 &&
        actionDurations.every((x) => x >= 0) &&
        simultaneousCredit >= 0 &&
        simultaneousCredit <= actionDurations.reduce((a, b) => a + b, 0),
    );
    return {
      accountedDuration:
        actionDurations.reduce((a, b) => a + b, 0) - simultaneousCredit,
      slack:
        sceneDuration -
        actionDurations.reduce((a, b) => a + b, 0) +
        simultaneousCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sceneDuration: 100,
    actionDurations: [40, 50],
    simultaneousCredit: 10,
  },
  output: { accountedDuration: 80, slack: 20 },
} satisfies ToolExample<Input, Output>;
export const sceneElapsedTimeSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/scene-elapsed-time-slack",
    title: "Scene Elapsed Time Slack Tool",
    description:
      "Calculate scene elapsed time slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneDuration: { type: "number", minimum: 0 },
        actionDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        simultaneousCredit: { type: "number", minimum: 0 },
      },
      required: ["sceneDuration", "actionDurations", "simultaneousCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accountedDuration: { type: "number" },
        slack: { type: "number" },
      },
      required: ["accountedDuration", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "sceneDuration",
          label: "Scene Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actionDurations",
          label: "Action Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "simultaneousCredit",
          label: "Simultaneous Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "accountedDuration",
          label: "Accounted Duration",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sceneElapsedTimeSlackTool.execute;
export default sceneElapsedTimeSlackTool;
