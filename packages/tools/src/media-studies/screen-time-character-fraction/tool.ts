import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterSeconds: number;
  readonly analyzedSeconds: number;
};
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterSeconds: { type: "number", minimum: 0 },
    analyzedSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["characterSeconds", "analyzedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Compute a character's observed screen-time fraction under a caller-supplied coding convention, allowing overlap between different characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterSeconds, analyzedSeconds } = request;
  const compute = (): Output => {
    (H.domain(analyzedSeconds > 0, "analyzedSeconds"), analyzedSeconds);
    H.domain(
      characterSeconds >= 0 && characterSeconds <= analyzedSeconds,
      "characterSeconds",
    );
    return { fraction: characterSeconds / analyzedSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characterSeconds: 120, analyzedSeconds: 600 },
  output: { fraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const screenTimeCharacterFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/screen-time-character-fraction",
    title: "Screen Time Character Fraction Tool",
    description:
      "Compute a character's observed screen-time fraction under a caller-supplied coding convention, allowing overlap between different characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterSeconds: { type: "number", minimum: 0 },
        analyzedSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["characterSeconds", "analyzedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "characterSeconds",
          label: "Character Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analyzedSeconds",
          label: "Analyzed Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = screenTimeCharacterFractionTool.execute;
export default screenTimeCharacterFractionTool;
