import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly h3k4me3Signal: number;
  readonly h3k27me3Signal: number;
  readonly minimumSignal: number;
}>;
export type Output = Readonly<{
  readonly h3k4Present: boolean;
  readonly h3k27Present: boolean;
  readonly bivalent: boolean;
}>;

export const calculate = (input: Input): Output => {
  const h3k4Present = input.h3k4me3Signal >= input.minimumSignal,
    h3k27Present = input.h3k27me3Signal >= input.minimumSignal;
  return { h3k4Present, h3k27Present, bivalent: h3k4Present && h3k27Present };
};

export const exampleInput = {
  h3k4me3Signal: 10,
  h3k27me3Signal: 12,
  minimumSignal: 8,
} satisfies Input;
export const exampleOutput = {
  h3k4Present: true,
  h3k27Present: true,
  bivalent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      h3k4me3Signal: input.h3k4me3Signal as number,
      h3k27me3Signal: input.h3k27me3Signal as number,
      minimumSignal: input.minimumSignal as number,
    }),
  description:
    "Flag promoter bivalency from activating and repressive mark signals.",
  id: "epigenetics/bivalent-promoter",
  inputs: [
    {
      id: "h3k4me3Signal",
      label: "H3K4me3 signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "h3k27me3Signal",
      label: "H3K27me3 signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumSignal",
      label: "Minimum mark signal",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "h3k4Present", label: "H3K4me3 present", kind: "boolean" },
    { id: "h3k27Present", label: "H3K27me3 present", kind: "boolean" },
    { id: "bivalent", label: "Bivalent promoter", kind: "boolean" },
  ],
  title: "Bivalent Promoter",
});

export const run = tool.execute;
export default tool;
