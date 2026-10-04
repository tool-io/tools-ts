import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerTurns: number;
  readonly totalTurns: number;
};
export type Output = { readonly turnShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerTurns: { type: "integer", minimum: 0 },
    totalTurns: { type: "integer", minimum: 1 },
  },
  required: ["speakerTurns", "totalTurns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { turnShare: { type: "number" } },
  required: ["turnShare"],
} as const;
/** Calculate a speaker's count share from an explicit meeting-turn coding convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerTurns, totalTurns } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalTurns) &&
        totalTurns >= 1 &&
        totalTurns <= Number.MAX_SAFE_INTEGER,
      "totalTurns",
    ),
      totalTurns);
    (H.domain(
      Number.isSafeInteger(speakerTurns) &&
        speakerTurns >= 0 &&
        speakerTurns <= totalTurns,
      "speakerTurns",
    ),
      speakerTurns);
    return { turnShare: speakerTurns / totalTurns };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakerTurns: 8, totalTurns: 20 },
  output: { turnShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const meetingTurnShareSpeakerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/meeting-turn-share-speaker",
    title: "Meeting Turn Share Speaker Tool",
    description:
      "Calculate a speaker's count share from an explicit meeting-turn coding convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerTurns: { type: "integer", minimum: 0 },
        totalTurns: { type: "integer", minimum: 1 },
      },
      required: ["speakerTurns", "totalTurns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { turnShare: { type: "number" } },
      required: ["turnShare"],
    },
    ports: {
      inputs: [
        {
          id: "speakerTurns",
          label: "Speaker Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalTurns",
          label: "Total Turns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "turnShare", label: "Turn Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meetingTurnShareSpeakerTool.execute;
export default meetingTurnShareSpeakerTool;
