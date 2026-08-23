import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcronymInput = {
  readonly text: string;
};

export type AcronymOutput = {
  readonly acronym: string;
};

export const acronymExample = {
  input: { text: "portable network graphics" },
  output: { acronym: "PNG" },
} satisfies ToolExample<AcronymInput, AcronymOutput>;

export const acronymTool = createSimpleTool({
  id: "text/acronym",
  title: "Acronym Generator",
  description:
    "Build an acronym from the uppercase first letter of each whitespace-separated word.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "acronym", label: "Acronym", kind: "string" }],
  calculate: (input) => {
    const words = (input.text as string).split(/\s+/).filter(Boolean);
    if (words.length === 0)
      simpleError("text", "Text must contain at least one word.", "empty_text");
    return {
      acronym: words.map((word) => word.charAt(0).toUpperCase()).join(""),
    };
  },
});
export const runAcronym = acronymTool.execute;
export default acronymTool;
