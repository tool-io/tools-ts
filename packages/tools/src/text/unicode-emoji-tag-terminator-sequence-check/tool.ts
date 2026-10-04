import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly valid: boolean; readonly tagCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, tagCount: { type: "integer" } },
  required: ["valid", "tagCount"],
} as const;
/** Check the black-flag tag-sequence structural form without asserting registry membership or rendered flag support. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const p = Array.from(text),
      base = p[0]?.codePointAt(0),
      cancel = p[p.length - 1]?.codePointAt(0);
    const tagCount = Math.max(0, p.length - 2);
    return {
      valid:
        base === 127988 &&
        cancel === 917631 &&
        tagCount > 0 &&
        p.slice(1, -1).every((c) => {
          const n = c.codePointAt(0) ?? 0;
          return n >= 917536 && n <= 917630;
        }),
      tagCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "🏴󠁧󠁢󠁿" },
  output: { valid: true, tagCount: 2 },
} satisfies ToolExample<Input, Output>;
export const unicodeEmojiTagTerminatorSequenceCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/unicode-emoji-tag-terminator-sequence-check",
      title: "Unicode Emoji Tag Terminator Sequence Check Tool",
      description:
        "Check the black-flag tag-sequence structural form without asserting registry membership or rendered flag support.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          tagCount: { type: "integer" },
        },
        required: ["valid", "tagCount"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
          {
            id: "tagCount",
            label: "Tag Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = unicodeEmojiTagTerminatorSequenceCheckTool.execute;
export default unicodeEmojiTagTerminatorSequenceCheckTool;
