import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sequenceContext: string;
}>;
export type Output = Readonly<{
  readonly contextClass: string;
  readonly valid: boolean;
}>;

export const calculate = (input: Input): Output => {
  const s = input.sequenceContext.trim().toUpperCase().slice(0, 3);
  const contextClass = /^CG/.test(s)
    ? "CG"
    : /^C[ACT]G$/.test(s)
      ? "CHG"
      : /^C[ACT][ACT]$/.test(s)
        ? "CHH"
        : "invalid";
  return { contextClass, valid: contextClass !== "invalid" };
};

export const exampleInput = { sequenceContext: "CAG" } satisfies Input;
export const exampleOutput = {
  contextClass: "CHG",
  valid: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sequenceContext: input.sequenceContext as string,
    }),
  description: "Classify a cytosine as CG, CHG, or CHH context.",
  id: "epigenetics/methylation-context",
  inputs: [
    { id: "sequenceContext", label: "Sequence context", kind: "string" },
  ],
  outputs: [
    {
      id: "contextClass",
      label: "Context class",
      kind: "string",
      enum: ["CG", "CHG", "CHH", "invalid"],
    },
    { id: "valid", label: "Valid context", kind: "boolean" },
  ],
  title: "Methylation Context",
});

export const run = tool.execute;
export default tool;
