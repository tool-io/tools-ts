import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerBookLines: readonly string[];
  readonly lineOneBased: number;
  readonly wordOneBased: number;
}>;
export type Output = Readonly<{ readonly word: string }>;
const inputFields = [
  { id: "callerBookLines", label: "Caller book lines", kind: "stringList" },
  { id: "lineOneBased", label: "Line one based", kind: "number" },
  { id: "wordOneBased", label: "Word one based", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.lineOneBased, "line", 1, input.callerBookLines.length);
  const words = input.callerBookLines[input.lineOneBased - 1].split(" ");
  if (words.some((w) => !w || !/^[A-Z]+$(?![\s\S])/.test(w)))
    simpleError(
      "book",
      "Caller canonical uppercase single-space word tokenization required.",
    );
  bounded(input.wordOneBased, "word", 1, words.length);
  return { word: words[input.wordOneBased - 1] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBookLines: ["ONE TWO", "THREE FOUR"],
  lineOneBased: 2,
  wordOneBased: 1,
} satisfies Input;
export const exampleOutput = { word: "THREE" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/book-cipher-word-coordinate-lookup",
  title: "Book Cipher Word Coordinate Lookup",
  description:
    "Lookup exact one-based line/word coordinates in caller supplied canonical book text, no punctuation normalization or assumed book edition. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "word", label: "Word", kind: "string" }],
  calculate: (value) =>
    calculate({
      callerBookLines: value.callerBookLines as readonly string[],
      lineOneBased: value.lineOneBased as number,
      wordOneBased: value.wordOneBased as number,
    }),
});
export const run = tool.execute;
export default tool;
