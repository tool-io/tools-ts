import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const charAtIndexTool = createSimpleTool({
  id: "text/char-at-index",
  title: "Character at Index",
  description: "Return the Unicode code point at a zero-based index.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "index", label: "Index", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "character", label: "Character", kind: "string" }],
  calculate: (input) => {
    const characters = Array.from(input.text as string);
    const index = input.index as number;
    if (index >= characters.length)
      simpleError("index", "The index is beyond the end of the text.");
    return { character: characters[index] ?? "" };
  },
});
export const runCharAtIndex = charAtIndexTool.execute;
export default charAtIndexTool;

export type CharAtIndexInput = {
  readonly text: string;
  readonly index: number;
};

export type CharAtIndexOutput = {
  readonly character: string;
};

export const charAtIndexExample = {
  input: {
    text: "example",
    index: 1,
  },
  output: {
    character: "x",
  },
} satisfies ToolExample<CharAtIndexInput, CharAtIndexOutput>;
