import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly whyAnswers: readonly string[];
  readonly requiredDepth: number;
}>;
export type Output = Readonly<{
  readonly answeredDepth: number;
  readonly repeatedAnswers: readonly string[];
  readonly reachesRequiredDepth: boolean;
  readonly chainUsable: boolean;
}>;

export const calculate = (input: Input): Output => {
  const answers = input.whyAnswers
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
    repeatedAnswers = [
      ...new Set(
        answers.filter((value, index) => answers.indexOf(value) !== index),
      ),
    ],
    answeredDepth = answers.length;
  return {
    answeredDepth,
    repeatedAnswers,
    reachesRequiredDepth: answeredDepth >= input.requiredDepth,
    chainUsable:
      answeredDepth >= input.requiredDepth && repeatedAnswers.length === 0,
  };
};

export const exampleInput = {
  whyAnswers: [
    "power failed",
    "breaker opened",
    "overload occurred",
    "load estimate was stale",
    "review was skipped",
  ],
  requiredDepth: 5,
} satisfies Input;
export const exampleOutput = {
  answeredDepth: 5,
  repeatedAnswers: [],
  reachesRequiredDepth: true,
  chainUsable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      whyAnswers: input.whyAnswers as readonly string[],
      requiredDepth: input.requiredDepth as number,
    }),
  description: "Check a five-whys chain for depth and repeated answers.",
  id: "futurology/five-whys-chain",
  inputs: [
    { id: "whyAnswers", label: "Successive why answers", kind: "stringList" },
    {
      id: "requiredDepth",
      label: "Required why depth",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "answeredDepth",
      label: "Answered why depth",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "repeatedAnswers",
      label: "Repeated normalized answers",
      kind: "stringList",
    },
    {
      id: "reachesRequiredDepth",
      label: "Reaches supplied depth",
      kind: "boolean",
    },
    {
      id: "chainUsable",
      label: "Chain has depth and no repeated answer",
      kind: "boolean",
    },
  ],
  title: "Five-Whys Chain",
});

export const run = tool.execute;
export default tool;
