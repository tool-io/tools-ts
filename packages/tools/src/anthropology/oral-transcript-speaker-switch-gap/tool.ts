import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly sameSpeaker: boolean;
};
export type Output = { readonly gap: number; readonly speakerSwitch: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
    sameSpeaker: { type: "boolean" },
  },
  required: ["previousEnd", "nextStart", "sameSpeaker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, speakerSwitch: { type: "boolean" } },
  required: ["gap", "speakerSwitch"],
} as const;
/** Compare supplied turn boundaries and a caller-declared speaker identity relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart, sameSpeaker } = request;
  const compute = (): Output => {
    return { gap: nextStart - previousEnd, speakerSwitch: !sameSpeaker };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEnd: 12, nextStart: 14, sameSpeaker: false },
  output: { gap: 2, speakerSwitch: true },
} satisfies ToolExample<Input, Output>;
export const oralTranscriptSpeakerSwitchGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/oral-transcript-speaker-switch-gap",
    title: "Oral Transcript Speaker Switch Gap Tool",
    description:
      "Compare supplied turn boundaries and a caller-declared speaker identity relation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
        sameSpeaker: { type: "boolean" },
      },
      required: ["previousEnd", "nextStart", "sameSpeaker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        speakerSwitch: { type: "boolean" },
      },
      required: ["gap", "speakerSwitch"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sameSpeaker",
          label: "Same Speaker",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "speakerSwitch",
          label: "Speaker Switch",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralTranscriptSpeakerSwitchGapTool.execute;
export default oralTranscriptSpeakerSwitchGapTool;
