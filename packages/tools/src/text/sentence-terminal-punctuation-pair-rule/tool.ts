import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: string; readonly second: string };
export type Output = { readonly redundant: boolean; readonly collapse: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192, enum: [".", "!", "?"] },
    second: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redundant: { type: "boolean" },
    collapse: { type: "string", maxLength: 8192 },
  },
  required: ["redundant", "collapse"],
} as const;
/** Calculate sentence terminal punctuation pair rule from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(
      [".", "!", "?"].includes(first) && [".", "!", "?"].includes(second),
    );
    return {
      redundant: first === second,
      collapse: first === second ? first : first + second,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "!", second: "!" },
  output: { redundant: true, collapse: "!" },
} satisfies ToolExample<Input, Output>;
export const sentenceTerminalPunctuationPairRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/sentence-terminal-punctuation-pair-rule",
      title: "Sentence Terminal Punctuation Pair Rule Tool",
      description:
        "Calculate sentence terminal punctuation pair rule from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "string", maxLength: 8192, enum: [".", "!", "?"] },
          second: { type: "string", maxLength: 8192 },
        },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redundant: { type: "boolean" },
          collapse: { type: "string", maxLength: 8192 },
        },
        required: ["redundant", "collapse"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "redundant",
            label: "Redundant",
            valueType: { type: "boolean" },
          },
          { id: "collapse", label: "Collapse", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = sentenceTerminalPunctuationPairRuleTool.execute;
export default sentenceTerminalPunctuationPairRuleTool;
