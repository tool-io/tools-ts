import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSeconds: number;
  readonly stageStartSeconds: number;
};
export type Output = {
  readonly stageRelativeSeconds: number;
  readonly beforeStage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSeconds: { type: "number" },
    stageStartSeconds: { type: "number" },
  },
  required: ["eventSeconds", "stageStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageRelativeSeconds: { type: "number" },
    beforeStage: { type: "boolean" },
  },
  required: ["stageRelativeSeconds", "beforeStage"],
} as const;
/** Reference a supplied event time to an explicit exercise-stage start without classifying exercise intensity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventSeconds, stageStartSeconds } = request;
  const compute = (): Output => {
    return {
      stageRelativeSeconds: eventSeconds - stageStartSeconds,
      beforeStage: eventSeconds < stageStartSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventSeconds: 155, stageStartSeconds: 120 },
  output: { stageRelativeSeconds: 35, beforeStage: false },
} satisfies ToolExample<Input, Output>;
export const exerciseStageRelativeTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physiology", "biology"],
      keywords: ["physiology", "biology"],
    },
    id: "physiology/exercise-stage-relative-time",
    title: "Exercise Stage Relative Time",
    description:
      "Reference a supplied event time to an explicit exercise-stage start without classifying exercise intensity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSeconds: { type: "number" },
        stageStartSeconds: { type: "number" },
      },
      required: ["eventSeconds", "stageStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageRelativeSeconds: { type: "number" },
        beforeStage: { type: "boolean" },
      },
      required: ["stageRelativeSeconds", "beforeStage"],
    },
    ports: {
      inputs: [
        {
          id: "eventSeconds",
          label: "Event Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stageStartSeconds",
          label: "Stage Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stageRelativeSeconds",
          label: "Stage Relative Seconds",
          valueType: { type: "number" },
        },
        {
          id: "beforeStage",
          label: "Before Stage",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exerciseStageRelativeTimeTool.execute;
export default exerciseStageRelativeTimeTool;
