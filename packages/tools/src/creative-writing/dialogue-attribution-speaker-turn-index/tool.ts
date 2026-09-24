import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakers: readonly string[];
  readonly tokenLine: number;
};
export type Output = {
  readonly turnIndex: number;
  readonly currentSpeaker: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tokenLine: { type: "integer", minimum: 0 },
  },
  required: ["speakers", "tokenLine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnIndex: { type: "integer" },
    currentSpeaker: { type: "string", maxLength: 8192 },
  },
  required: ["turnIndex", "currentSpeaker"],
} as const;
/** Map a zero-based line index to a zero-based contiguous speaker turn from caller-provided speaker labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakers, tokenLine } = request;
  const compute = (): Output => {
    H.integer(tokenLine, 0, speakers.length - 1);
    let turnIndex = 0;
    for (let i = 1; i <= tokenLine; i++)
      if (speakers[i] !== speakers[i - 1]) turnIndex++;
    return { turnIndex, currentSpeaker: speakers[tokenLine] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakers: ["A", "A", "B", "B", "A"], tokenLine: 3 },
  output: { turnIndex: 1, currentSpeaker: "B" },
} satisfies ToolExample<Input, Output>;
export const dialogueAttributionSpeakerTurnIndexTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "creative-writing/dialogue-attribution-speaker-turn-index",
      title: "Dialogue Attribution Speaker Turn Index Tool",
      description:
        "Map a zero-based line index to a zero-based contiguous speaker turn from caller-provided speaker labels.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          speakers: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          tokenLine: { type: "integer", minimum: 0 },
        },
        required: ["speakers", "tokenLine"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          turnIndex: { type: "integer" },
          currentSpeaker: { type: "string", maxLength: 8192 },
        },
        required: ["turnIndex", "currentSpeaker"],
      },
      ports: {
        inputs: [
          {
            id: "speakers",
            label: "Speakers",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "tokenLine",
            label: "Token Line",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "turnIndex",
            label: "Turn Index",
            valueType: { type: "integer" },
          },
          {
            id: "currentSpeaker",
            label: "Current Speaker",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dialogueAttributionSpeakerTurnIndexTool.execute;
export default dialogueAttributionSpeakerTurnIndexTool;
