import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableStart: number;
  readonly nextCue: number;
  readonly requiredReset: number;
};
export type Output = {
  readonly availableDuration: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableStart: { type: "number" },
    nextCue: { type: "number" },
    requiredReset: { type: "number", minimum: 0 },
  },
  required: ["availableStart", "nextCue", "requiredReset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableDuration: { type: "number" },
    slack: { type: "number" },
  },
  required: ["availableDuration", "slack"],
} as const;
/** Calculate prop reset buffer duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableStart, nextCue, requiredReset } = request;
  const compute = (): Output => {
    H.domain(requiredReset >= 0);
    return {
      availableDuration: nextCue - availableStart,
      slack: nextCue - availableStart - requiredReset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableStart: 10, nextCue: 20, requiredReset: 6 },
  output: { availableDuration: 10, slack: 4 },
} satisfies ToolExample<Input, Output>;
export const propResetBufferDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/prop-reset-buffer-duration",
    title: "Prop Reset Buffer Duration Tool",
    description:
      "Calculate prop reset buffer duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableStart: { type: "number" },
        nextCue: { type: "number" },
        requiredReset: { type: "number", minimum: 0 },
      },
      required: ["availableStart", "nextCue", "requiredReset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableDuration: { type: "number" },
        slack: { type: "number" },
      },
      required: ["availableDuration", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "availableStart",
          label: "Available Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextCue",
          label: "Next Cue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredReset",
          label: "Required Reset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableDuration",
          label: "Available Duration",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = propResetBufferDurationTool.execute;
export default propResetBufferDurationTool;
