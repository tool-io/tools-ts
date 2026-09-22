import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly separator: string };
export type Output = {
  readonly lines: readonly string[];
  readonly joined: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["text", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lines: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    joined: { type: "string", maxLength: 8192 },
  },
  required: ["lines", "joined"],
} as const;
/** Preserve empty inscription lines while normalizing CRLF and CR to LF before an explicit separator join. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, separator } = request;
  const compute = (): Output => {
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    H.domain(lines.length <= 256);
    return { lines, joined: lines.join(separator) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "A\r\nB", separator: " / " },
  output: { lines: ["A", "B"], joined: "A / B" },
} satisfies ToolExample<Input, Output>;
export const artworkInscriptionLineBreakTranscriptionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-history/artwork-inscription-line-break-transcription",
      title: "Artwork Inscription Line Break Transcription Tool",
      description:
        "Preserve empty inscription lines while normalizing CRLF and CR to LF before an explicit separator join.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          separator: { type: "string", maxLength: 8192 },
        },
        required: ["text", "separator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lines: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          joined: { type: "string", maxLength: 8192 },
        },
        required: ["lines", "joined"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lines",
            label: "Lines",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "joined", label: "Joined", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = artworkInscriptionLineBreakTranscriptionTool.execute;
export default artworkInscriptionLineBreakTranscriptionTool;
