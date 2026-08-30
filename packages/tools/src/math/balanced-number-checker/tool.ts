import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, integer } from "../batch-shared.js";
export type Input = Readonly<{ readonly decimalInteger: string }>;
export type Output = Readonly<{
  readonly leftHalfDigitSum: number;
  readonly rightHalfDigitSum: number;
  readonly isBalanced: boolean;
}>;
const inputFields = [
  { id: "decimalInteger", label: "Decimal integer", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^(?:0|[1-9][0-9]{0,127})$/.test(input.decimalInteger))
    simpleError(
      "decimalInteger",
      "Canonical unsigned ASCII decimal integer of at most 128 digits required.",
    );
  const s = input.decimalInteger,
    h = Math.floor(s.length / 2),
    sum = (text: string) => [...text].reduce((n, c) => n + Number(c), 0),
    l = sum(s.slice(0, h)),
    r = sum(s.slice(s.length - h));
  return { leftHalfDigitSum: l, rightHalfDigitSum: r, isBalanced: l === r };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { decimalInteger: "123321" } satisfies Input;
export const exampleOutput = {
  leftHalfDigitSum: 6,
  rightHalfDigitSum: 6,
  isBalanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/balanced-number-checker",
  title: "Balanced Number Checker",
  description:
    "Compare sums of decimal digit halves, ignoring an odd central digit; arbitrary-length canonical decimal text preserves exact identity, unlike palindrome checks.",
  inputs: inputFields,
  outputs: [
    { id: "leftHalfDigitSum", label: "Left half digit sum", kind: "number" },
    { id: "rightHalfDigitSum", label: "Right half digit sum", kind: "number" },
    { id: "isBalanced", label: "Is balanced", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ decimalInteger: value.decimalInteger as string }),
});
export const run = tool.execute;
export default tool;
