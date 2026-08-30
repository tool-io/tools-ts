import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly h3k4me1Signal: number;
  readonly h3k4me3Signal: number;
  readonly minimumSignal: number;
}>;
export type Output = Readonly<{
  readonly me1ToMe3Ratio: number;
  readonly state: string;
}>;

export const calculate = (input: Input): Output => {
  const one = input.h3k4me1Signal >= input.minimumSignal,
    three = input.h3k4me3Signal >= input.minimumSignal,
    me1ToMe3Ratio =
      input.h3k4me3Signal === 0
        ? input.h3k4me1Signal
        : input.h3k4me1Signal / input.h3k4me3Signal;
  return {
    me1ToMe3Ratio,
    state:
      one && three
        ? me1ToMe3Ratio > 1
          ? "enhancer"
          : "promoter"
        : one
          ? "poised"
          : three
            ? "promoter"
            : "unmarked",
  };
};

export const exampleInput = {
  h3k4me1Signal: 20,
  h3k4me3Signal: 10,
  minimumSignal: 5,
} satisfies Input;
export const exampleOutput = {
  me1ToMe3Ratio: 2,
  state: "enhancer",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      h3k4me1Signal: input.h3k4me1Signal as number,
      h3k4me3Signal: input.h3k4me3Signal as number,
      minimumSignal: input.minimumSignal as number,
    }),
  description: "Resolve promoter-enhancer state from H3K4 methylation signals.",
  id: "epigenetics/promoter-enhancer-state",
  inputs: [
    {
      id: "h3k4me1Signal",
      label: "H3K4me1 signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "h3k4me3Signal",
      label: "H3K4me3 signal",
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
    {
      id: "me1ToMe3Ratio",
      label: "H3K4me1-to-H3K4me3 ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "state",
      label: "Regulatory state",
      kind: "string",
      enum: ["promoter", "enhancer", "poised", "unmarked"],
    },
  ],
  title: "Promoter–Enhancer State",
});

export const run = tool.execute;
export default tool;
