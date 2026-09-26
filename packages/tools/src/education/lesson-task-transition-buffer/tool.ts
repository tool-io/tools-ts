import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nextStart: number;
  readonly previousEnd: number;
  readonly requiredBuffer: number;
};
export type Output = {
  readonly availableBuffer: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextStart: { type: "number" },
    previousEnd: { type: "number" },
    requiredBuffer: { type: "number", minimum: 0 },
  },
  required: ["nextStart", "previousEnd", "requiredBuffer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableBuffer: { type: "number" },
    slack: { type: "number" },
  },
  required: ["availableBuffer", "slack"],
} as const;
/** Calculate lesson task transition buffer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nextStart, previousEnd, requiredBuffer } = request;
  const compute = (): Output => {
    H.domain(requiredBuffer >= 0);
    return {
      availableBuffer: nextStart - previousEnd,
      slack: nextStart - previousEnd - requiredBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nextStart: 30, previousEnd: 20, requiredBuffer: 5 },
  output: { availableBuffer: 10, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const lessonTaskTransitionBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/lesson-task-transition-buffer",
    title: "Lesson Task Transition Buffer Tool",
    description:
      "Calculate lesson task transition buffer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextStart: { type: "number" },
        previousEnd: { type: "number" },
        requiredBuffer: { type: "number", minimum: 0 },
      },
      required: ["nextStart", "previousEnd", "requiredBuffer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableBuffer: { type: "number" },
        slack: { type: "number" },
      },
      required: ["availableBuffer", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredBuffer",
          label: "Required Buffer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableBuffer",
          label: "Available Buffer",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lessonTaskTransitionBufferTool.execute;
export default lessonTaskTransitionBufferTool;
