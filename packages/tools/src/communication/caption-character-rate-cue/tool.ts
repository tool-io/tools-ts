import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterCount: number;
  readonly durationSeconds: number;
};
export type Output = { readonly charactersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterCount: { type: "integer", minimum: 0 },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["characterCount", "durationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { charactersPerSecond: { type: "number" } },
  required: ["charactersPerSecond"],
} as const;
/** Calculate a cue's character rate from a supplied character-count convention and positive duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterCount, durationSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(characterCount) &&
        characterCount >= 0 &&
        characterCount <= Number.MAX_SAFE_INTEGER,
      "characterCount",
    ),
      characterCount);
    (H.domain(durationSeconds > 0, "durationSeconds"), durationSeconds);
    return { charactersPerSecond: characterCount / durationSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characterCount: 42, durationSeconds: 3 },
  output: { charactersPerSecond: 14 },
} satisfies ToolExample<Input, Output>;
export const captionCharacterRateCueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/caption-character-rate-cue",
    title: "Caption Character Rate Cue Tool",
    description:
      "Calculate a cue's character rate from a supplied character-count convention and positive duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterCount: { type: "integer", minimum: 0 },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["characterCount", "durationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { charactersPerSecond: { type: "number" } },
      required: ["charactersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "characterCount",
          label: "Character Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "charactersPerSecond",
          label: "Characters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionCharacterRateCueTool.execute;
export default captionCharacterRateCueTool;
