import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const removeDiacriticsTool = createSimpleTool({
  id: "text/remove-diacritics",
  title: "Remove Diacritics",
  description:
    "Strip diacritical marks from Unicode text, returning plain ASCII equivalents.",
  inputs: [
    {
      description: "Unicode text with possible diacritics.",
      id: "text",
      label: "Text",
      kind: "string",
    },
  ],
  outputs: [
    {
      description: "Text with diacritics removed.",
      id: "plainText",
      label: "Plain text",
      kind: "string",
    },
  ],
  calculate: (input) => {
    return {
      plainText: (input.text as string)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/gu, ""),
    };
  },
});
export const runRemoveDiacritics = removeDiacriticsTool.execute;
export default removeDiacriticsTool;

export type RemoveDiacriticsInput = {
  readonly text: string;
};

export type RemoveDiacriticsOutput = {
  readonly plainText: string;
};

export const removeDiacriticsExample = {
  input: {
    text: "example",
  },
  output: {
    plainText: "example",
  },
} satisfies ToolExample<RemoveDiacriticsInput, RemoveDiacriticsOutput>;
