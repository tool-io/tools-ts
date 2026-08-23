import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ExtractMentionsInput = {
  readonly text: string;
};

export type ExtractMentionsOutput = {
  readonly mentions: string[];
};

export const extractMentionsExample = {
  input: { text: "Thanks @alice and @bob_x for the review!" },
  output: { mentions: ["alice", "bob_x"] },
} satisfies ToolExample<ExtractMentionsInput, ExtractMentionsOutput>;

export const extractMentionsTool = createSimpleTool({
  id: "text/extract-mentions",
  title: "Mention Extractor",
  description:
    "Extract all mention tokens without the @ symbol, in order of appearance.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "mentions", label: "Mentions", kind: "stringList" }],
  calculate: (input) => ({
    mentions: [...(input.text as string).matchAll(/@([A-Za-z0-9_]+)/g)].map(
      (match) => match[1],
    ),
  }),
});
export const runExtractMentions = extractMentionsTool.execute;
export default extractMentionsTool;
