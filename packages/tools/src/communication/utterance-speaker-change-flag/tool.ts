import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSpeaker: string;
  readonly nextSpeaker: string;
};
export type Output = { readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSpeaker: { type: "string", maxLength: 8192 },
    nextSpeaker: { type: "string", maxLength: 8192 },
  },
  required: ["previousSpeaker", "nextSpeaker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { changed: { type: "boolean" } },
  required: ["changed"],
} as const;
/** Compare adjacent utterance speaker codes literally; no speaker identity is inferred from audio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSpeaker, nextSpeaker } = request;
  const compute = (): Output => {
    H.domain(
      previousSpeaker.length > 0 && nextSpeaker.length > 0,
      "previousSpeaker",
    );
    return { changed: previousSpeaker !== nextSpeaker };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousSpeaker: "S1", nextSpeaker: "S2" },
  output: { changed: true },
} satisfies ToolExample<Input, Output>;
export const utteranceSpeakerChangeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/utterance-speaker-change-flag",
    title: "Utterance Speaker Change Flag Tool",
    description:
      "Compare adjacent utterance speaker codes literally; no speaker identity is inferred from audio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSpeaker: { type: "string", maxLength: 8192 },
        nextSpeaker: { type: "string", maxLength: 8192 },
      },
      required: ["previousSpeaker", "nextSpeaker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { changed: { type: "boolean" } },
      required: ["changed"],
    },
    ports: {
      inputs: [
        {
          id: "previousSpeaker",
          label: "Previous Speaker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextSpeaker",
          label: "Next Speaker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = utteranceSpeakerChangeFlagTool.execute;
export default utteranceSpeakerChangeFlagTool;
