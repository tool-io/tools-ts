import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type UppercaseCountInput = {
  readonly text: string;
};

export type UppercaseCountOutput = {
  readonly uppercaseCount: number;
};

export const uppercaseCountExample = {
  input: { text: "Hello World Ünïcode" },
  output: { uppercaseCount: 3 },
} satisfies ToolExample<UppercaseCountInput, UppercaseCountOutput>;

export const uppercaseCountTool = createSimpleTool({
  id: "text/uppercase-count",
  title: "Uppercase Letter Counter",
  description:
    "Count uppercase letters, including accented uppercase letters, in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "uppercaseCount",
      label: "Uppercase count",
      kind: "integer",
      format: "count",
    },
  ],
  calculate: (input) => ({
    uppercaseCount: ((input.text as string).match(/\p{Lu}/gu) ?? []).length,
  }),
});
export const runUppercaseCount = uppercaseCountTool.execute;
export default uppercaseCountTool;
