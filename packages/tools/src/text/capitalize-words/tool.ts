import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const capitalizeWordsTool = createSimpleTool({
  id: "text/capitalize-words",
  title: "Word Capitalizer",
  description: "Capitalize the first letter of every word in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "capitalized", label: "Capitalized text", kind: "string" }],
  calculate: (input) => {
    return {
      capitalized: (input.text as string).replace(
        /\S+/gu,
        (word) => word.charAt(0).toUpperCase() + word.slice(1),
      ),
    };
  },
});
export const runCapitalizeWords = capitalizeWordsTool.execute;
export default capitalizeWordsTool;

export type CapitalizeWordsInput = {
  readonly text: string;
};

export type CapitalizeWordsOutput = {
  readonly capitalized: string;
};

export const capitalizeWordsExample = {
  input: {
    text: "example",
  },
  output: {
    capitalized: "Example",
  },
} satisfies ToolExample<CapitalizeWordsInput, CapitalizeWordsOutput>;
