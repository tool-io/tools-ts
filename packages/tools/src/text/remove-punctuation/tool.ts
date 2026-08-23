import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RemovePunctuationInput = {
  readonly text: string;
};

export type RemovePunctuationOutput = {
  readonly result: string;
};

export const removePunctuationExample = {
  input: { text: "Hello, world!" },
  output: { result: "Hello world" },
} satisfies ToolExample<RemovePunctuationInput, RemovePunctuationOutput>;

export const removePunctuationTool = createSimpleTool({
  id: "text/remove-punctuation",
  title: "Remove Punctuation Tool",
  description:
    "Remove all Unicode punctuation characters while keeping letters, digits, symbols and whitespace.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "result", label: "Result", kind: "string" }],
  calculate: (input) => ({
    result: (input.text as string).replace(/\p{P}/gu, ""),
  }),
});
export const runRemovePunctuation = removePunctuationTool.execute;
export default removePunctuationTool;
