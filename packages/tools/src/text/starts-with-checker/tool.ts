import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StartsWithCheckerInput = {
  readonly text: string;
  readonly value: string;
};

export type StartsWithCheckerOutput = {
  readonly startsWith: boolean;
};

export const startsWithCheckerExample = {
  input: { text: "TypeScript rocks", value: "TypeScript" },
  output: { startsWith: true },
} satisfies ToolExample<StartsWithCheckerInput, StartsWithCheckerOutput>;

export const startsWithCheckerTool = createSimpleTool({
  id: "text/starts-with-checker",
  title: "Starts With Checker",
  description:
    "Check whether text starts with a value using a case-sensitive prefix comparison.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "value", label: "Value", kind: "string" },
  ],
  outputs: [{ id: "startsWith", label: "Starts with result", kind: "boolean" }],
  calculate: (input) => ({
    startsWith: (input.text as string).startsWith(input.value as string),
  }),
});
export const runStartsWithChecker = startsWithCheckerTool.execute;
export default startsWithCheckerTool;
