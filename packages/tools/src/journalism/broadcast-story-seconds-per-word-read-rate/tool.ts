import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly wordCount: number;
  readonly measuredWordsPerMinute: number;
  readonly fixedNonSpeechSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "wordCount", label: "Word count", kind: "number" },
  {
    id: "measuredWordsPerMinute",
    label: "Measured words per minute",
    kind: "number",
  },
  {
    id: "fixedNonSpeechSeconds",
    label: "Fixed non speech seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.wordCount, "words", 0, 1000000);
  positive(i.measuredWordsPerMinute, "rate");
  nonnegative(i.fixedNonSpeechSeconds, "extra");
  return {
    estimatedStorySeconds:
      (60 * i.wordCount) / i.measuredWordsPerMinute + i.fixedNonSpeechSeconds,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    wordCount: 150,
    measuredWordsPerMinute: 150,
    fixedNonSpeechSeconds: 10,
  },
  output: { result: { estimatedStorySeconds: 70 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/broadcast-story-seconds-per-word-read-rate",
  title: "Broadcast Story Seconds per Word Read Rate",
  description:
    "Broadcast duration inventory from independently measured delivery rate plus explicit nonspeech time; not guaranteed timing after edits.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
