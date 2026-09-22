import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly session: number;
  readonly instruction: number;
  readonly setup: number;
  readonly cleanupFloor: number;
};
export type Output = {
  readonly cleanupAvailable: number;
  readonly floorSlack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    session: { type: "number", minimum: 0 },
    instruction: { type: "number", minimum: 0 },
    setup: { type: "number", minimum: 0 },
    cleanupFloor: { type: "number", minimum: 0 },
  },
  required: ["session", "instruction", "setup", "cleanupFloor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cleanupAvailable: { type: "number" },
    floorSlack: { type: "number" },
  },
  required: ["cleanupAvailable", "floorSlack"],
} as const;
/** Calculate lesson cleanup time floor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { session, instruction, setup, cleanupFloor } = request;
  const compute = (): Output => {
    H.domain(
      session >= 0 && instruction >= 0 && setup >= 0 && cleanupFloor >= 0,
    );
    return {
      cleanupAvailable: session - instruction - setup,
      floorSlack: session - instruction - setup - cleanupFloor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { session: 60, instruction: 40, setup: 5, cleanupFloor: 10 },
  output: { cleanupAvailable: 15, floorSlack: 5 },
} satisfies ToolExample<Input, Output>;
export const lessonCleanupTimeFloorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/lesson-cleanup-time-floor",
    title: "Lesson Cleanup Time Floor Tool",
    description:
      "Calculate lesson cleanup time floor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        session: { type: "number", minimum: 0 },
        instruction: { type: "number", minimum: 0 },
        setup: { type: "number", minimum: 0 },
        cleanupFloor: { type: "number", minimum: 0 },
      },
      required: ["session", "instruction", "setup", "cleanupFloor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cleanupAvailable: { type: "number" },
        floorSlack: { type: "number" },
      },
      required: ["cleanupAvailable", "floorSlack"],
    },
    ports: {
      inputs: [
        {
          id: "session",
          label: "Session",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "instruction",
          label: "Instruction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setup",
          label: "Setup",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cleanupFloor",
          label: "Cleanup Floor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cleanupAvailable",
          label: "Cleanup Available",
          valueType: { type: "number" },
        },
        {
          id: "floorSlack",
          label: "Floor Slack",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lessonCleanupTimeFloorTool.execute;
export default lessonCleanupTimeFloorTool;
