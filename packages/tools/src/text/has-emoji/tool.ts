import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HasEmojiInput = {
  readonly text: string;
};

export type HasEmojiOutput = {
  readonly hasEmoji: boolean;
};

export const hasEmojiExample = {
  input: { text: "Ship it 🚀" },
  output: { hasEmoji: true },
} satisfies ToolExample<HasEmojiInput, HasEmojiOutput>;

export const hasEmojiTool = createSimpleTool({
  id: "text/has-emoji",
  title: "Has Emoji Checker",
  description:
    "Check whether text contains at least one emoji or pictographic character.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "hasEmoji", label: "Has emoji result", kind: "boolean" }],
  calculate: (input) => ({
    hasEmoji: /\p{Extended_Pictographic}/u.test(input.text as string),
  }),
});
export const runHasEmoji = hasEmojiTool.execute;
export default hasEmojiTool;
