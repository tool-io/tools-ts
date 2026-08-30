import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly teaseCopy: string;
  readonly maximumCharacters: number;
  readonly wordsPerMinute: number;
  readonly maximumSeconds: number;
}>;
export type Output = Readonly<{
  readonly characterCount: number;
  readonly wordCount: number;
  readonly estimatedSeconds: number;
  readonly fits: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.wordsPerMinute <= 0)
    simpleError(
      "wordsPerMinute",
      "Delivery speed must be positive.",
      "invalid_speed",
    );
  const characterCount = [...input.teaseCopy].length,
    wordCount = input.teaseCopy.trim()
      ? input.teaseCopy.trim().split(/\s+/).length
      : 0,
    estimatedSeconds = (wordCount / input.wordsPerMinute) * 60;
  return {
    characterCount,
    wordCount,
    estimatedSeconds,
    fits:
      characterCount <= input.maximumCharacters &&
      estimatedSeconds <= input.maximumSeconds,
  };
};

export const exampleInput = {
  teaseCopy: "Storm coverage at eleven",
  maximumCharacters: 30,
  wordsPerMinute: 120,
  maximumSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  characterCount: 24,
  wordCount: 4,
  estimatedSeconds: 2,
  fits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      teaseCopy: input.teaseCopy as string,
      maximumCharacters: input.maximumCharacters as number,
      wordsPerMinute: input.wordsPerMinute as number,
      maximumSeconds: input.maximumSeconds as number,
    }),
  description: "Check tease copy against character and spoken-runtime limits.",
  id: "journalism/tease-length",
  inputs: [
    { id: "teaseCopy", label: "Tease copy", kind: "string" },
    {
      id: "maximumCharacters",
      label: "Maximum characters",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "wordsPerMinute",
      label: "Estimated delivery speed",
      kind: "number",
      minimum: 0,
      unit: "words/min",
    },
    {
      id: "maximumSeconds",
      label: "Maximum delivery time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "characterCount",
      label: "Character count",
      kind: "integer",
      minimum: 0,
    },
    { id: "wordCount", label: "Word count", kind: "integer", minimum: 0 },
    {
      id: "estimatedSeconds",
      label: "Estimated delivery time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    { id: "fits", label: "Fits character and runtime limits", kind: "boolean" },
  ],
  title: "Tease Length",
});

export const run = tool.execute;
export default tool;
