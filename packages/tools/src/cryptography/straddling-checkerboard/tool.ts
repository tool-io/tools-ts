import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, alphabet } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerAlphabet: string;
  readonly callerBlankColumnDigits: readonly number[];
}>;
export type Output = Readonly<{
  readonly checkerboardLetterCodes: readonly string[];
}>;
const inputFields = [
  { id: "callerAlphabet", label: "Caller alphabet", kind: "string" },
  {
    id: "callerBlankColumnDigits",
    label: "Caller blank column digits",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  alphabet(input.callerAlphabet);
  if (
    input.callerBlankColumnDigits.length !== 2 ||
    input.callerBlankColumnDigits[0] === input.callerBlankColumnDigits[1]
  )
    simpleError(
      "blanks",
      "Two distinct explicit blank column digits required.",
    );
  input.callerBlankColumnDigits.forEach((v) => bounded(v, "blank", 0, 9));
  const top = Array.from({ length: 10 }, (_, i) => i)
      .filter((v) => !input.callerBlankColumnDigits.includes(v))
      .map(String),
    lower = input.callerBlankColumnDigits.flatMap((r) =>
      Array.from({ length: 10 }, (_, i) => String(r) + String(i)),
    );
  return { checkerboardLetterCodes: [...top, ...lower].slice(0, 26) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  callerBlankColumnDigits: [2, 6],
} satisfies Input;
export const exampleOutput = {
  checkerboardLetterCodes: [
    "0",
    "1",
    "3",
    "4",
    "5",
    "7",
    "8",
    "9",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/straddling-checkerboard",
  title: "Straddling Checkerboard Builder",
  description:
    "Build caller-ordered straddling checkerboard with eight single-digit positions and two ten-digit rows, truncate 28 available cells to26 letters. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [
    {
      id: "checkerboardLetterCodes",
      label: "Checkerboard letter codes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAlphabet: value.callerAlphabet as string,
      callerBlankColumnDigits:
        value.callerBlankColumnDigits as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
