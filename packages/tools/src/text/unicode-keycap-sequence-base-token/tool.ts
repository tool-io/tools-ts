import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly valid: boolean;
  readonly base: string;
  readonly variationSelector: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    base: { type: "string", maxLength: 8192 },
    variationSelector: { type: "boolean" },
  },
  required: ["valid", "base", "variationSelector"],
} as const;
/** Calculate unicode keycap sequence base token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const valid = /^[0-9#*]\ufe0f?\u20e3(?![\s\S])/.test(text);
    return {
      valid,
      base: valid ? text[0] : "",
      variationSelector: valid && text.includes("\ufe0f"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "1️⃣" },
  output: { valid: true, base: "1", variationSelector: true },
} satisfies ToolExample<Input, Output>;
export const unicodeKeycapSequenceBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-keycap-sequence-base-token",
    title: "Unicode Keycap Sequence Base Token Tool",
    description:
      "Calculate unicode keycap sequence base token from explicit caller-supplied inputs.",
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
        base: { type: "string", maxLength: 8192 },
        variationSelector: { type: "boolean" },
      },
      required: ["valid", "base", "variationSelector"],
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
        { id: "base", label: "Base", valueType: { type: "string" } },
        {
          id: "variationSelector",
          label: "Variation Selector",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeKeycapSequenceBaseTokenTool.execute;
export default unicodeKeycapSequenceBaseTokenTool;
