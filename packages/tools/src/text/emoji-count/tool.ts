import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EmojiCountInput = {
  readonly text: string;
};

export type EmojiCountOutput = {
  readonly emojiCount: number;
};

export const emojiCountExample = {
  input: { text: "Great job! 🎉🚀" },
  output: { emojiCount: 2 },
} satisfies ToolExample<EmojiCountInput, EmojiCountOutput>;

export const emojiCountTool = createSimpleTool({
  id: "text/emoji-count",
  title: "Emoji Count Tool",
  description: "Count extended pictographic emoji characters in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "emojiCount",
      label: "Emoji count",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => ({
    emojiCount: (
      (input.text as string).match(/\p{Extended_Pictographic}/gu) ?? []
    ).length,
  }),
});
export const runEmojiCount = emojiCountTool.execute;
export default emojiCountTool;
