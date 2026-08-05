import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const concatenateTwoStrings = (first: string, second: string): string =>
  first + second;

export const concatenateTwoStringsExample = {
  input: { first: "Tool.", second: "io" },
  output: { text: "Tool.io" },
} satisfies ToolExample<
  { readonly first: string; readonly second: string },
  { readonly text: string }
>;

export const concatenateTwoStringsTool = createSimpleTool({
  id: "text/concatenate-two-strings",
  title: "Concatenate Two Strings",
  description: "Join two strings without inserting or removing characters.",
  inputs: [
    { id: "first", kind: "string", label: "First string" },
    { id: "second", kind: "string", label: "Second string" },
  ],
  outputs: [{ id: "text", kind: "string", label: "Combined string" }],
  calculate: (input) => ({
    text: concatenateTwoStrings(input.first as string, input.second as string),
  }),
});

export const runConcatenateTwoStrings = concatenateTwoStringsTool.execute;
export default concatenateTwoStringsTool;
