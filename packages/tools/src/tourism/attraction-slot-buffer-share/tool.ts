import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotDuration: number;
  readonly bufferDuration: number;
};
export type Output = {
  readonly usableDuration: number;
  readonly bufferShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotDuration: { type: "number", exclusiveMinimum: 0 },
    bufferDuration: { type: "number", minimum: 0 },
  },
  required: ["slotDuration", "bufferDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableDuration: { type: "number" },
    bufferShare: { type: "number" },
  },
  required: ["usableDuration", "bufferShare"],
} as const;
/** Calculate attraction slot buffer share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotDuration, bufferDuration } = request;
  const compute = (): Output => {
    H.positive(slotDuration);
    H.domain(bufferDuration >= 0 && bufferDuration <= slotDuration);
    return {
      usableDuration: slotDuration - bufferDuration,
      bufferShare: bufferDuration / slotDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slotDuration: 60, bufferDuration: 15 },
  output: { usableDuration: 45, bufferShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const attractionSlotBufferShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/attraction-slot-buffer-share",
    title: "Attraction Slot Buffer Share Tool",
    description:
      "Calculate attraction slot buffer share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotDuration: { type: "number", exclusiveMinimum: 0 },
        bufferDuration: { type: "number", minimum: 0 },
      },
      required: ["slotDuration", "bufferDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableDuration: { type: "number" },
        bufferShare: { type: "number" },
      },
      required: ["usableDuration", "bufferShare"],
    },
    ports: {
      inputs: [
        {
          id: "slotDuration",
          label: "Slot Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferDuration",
          label: "Buffer Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableDuration",
          label: "Usable Duration",
          valueType: { type: "number" },
        },
        {
          id: "bufferShare",
          label: "Buffer Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = attractionSlotBufferShareTool.execute;
export default attractionSlotBufferShareTool;
