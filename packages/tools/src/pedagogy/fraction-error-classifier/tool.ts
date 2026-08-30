import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstNumerator: number;
  readonly firstDenominator: number;
  readonly secondNumerator: number;
  readonly secondDenominator: number;
  readonly studentNumerator: number;
  readonly studentDenominator: number;
}>;
export type Output = Readonly<{
  readonly expectedNumerator: number;
  readonly expectedDenominator: number;
  readonly errorClass: string;
}>;
export const calculate = (input: Input): Output => {
  const i = input;
  if (
    [i.firstDenominator, i.secondDenominator, i.studentDenominator].some(
      (v) => !Number.isSafeInteger(v) || v <= 0,
    ) ||
    [i.firstNumerator, i.secondNumerator, i.studentNumerator].some(
      (v) => !Number.isSafeInteger(v),
    )
  )
    simpleError(
      "firstDenominator",
      "Integer numerators and positive integer denominators required.",
    );
  const rawNumerator =
      i.firstNumerator * i.secondDenominator +
      i.secondNumerator * i.firstDenominator,
    rawDenominator = i.firstDenominator * i.secondDenominator;
  let a = Math.abs(rawNumerator),
    b = rawDenominator;
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  const expectedNumerator = rawNumerator / a,
    expectedDenominator = rawDenominator / a;
  let errorClass = "other";
  if (
    i.studentNumerator * expectedDenominator ===
    expectedNumerator * i.studentDenominator
  )
    errorClass = "correct";
  else if (
    i.firstDenominator === i.secondDenominator &&
    i.studentNumerator === i.firstNumerator + i.secondNumerator &&
    i.studentDenominator === i.firstDenominator + i.secondDenominator
  )
    errorClass = "added-denominators";
  return { expectedNumerator, expectedDenominator, errorClass };
};
export const exampleInput = {
  firstNumerator: 1,
  firstDenominator: 4,
  secondNumerator: 2,
  secondDenominator: 4,
  studentNumerator: 3,
  studentDenominator: 8,
} satisfies Input;
export const exampleOutput = {
  expectedNumerator: 3,
  expectedDenominator: 4,
  errorClass: "added-denominators",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/fraction-error-classifier",
  title: "Fraction Error Classifier",
  description:
    "Detect the add-the-denominators misconception in a fraction-addition response.",
  inputs: [
    { id: "firstNumerator", label: "First numerator", kind: "number" },
    { id: "firstDenominator", label: "First denominator", kind: "number" },
    { id: "secondNumerator", label: "Second numerator", kind: "number" },
    { id: "secondDenominator", label: "Second denominator", kind: "number" },
    { id: "studentNumerator", label: "Student numerator", kind: "number" },
    { id: "studentDenominator", label: "Student denominator", kind: "number" },
  ],
  outputs: [
    { id: "expectedNumerator", label: "Expected numerator", kind: "number" },
    {
      id: "expectedDenominator",
      label: "Expected denominator",
      kind: "number",
    },
    { id: "errorClass", label: "Error class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      firstNumerator: value.firstNumerator as number,
      firstDenominator: value.firstDenominator as number,
      secondNumerator: value.secondNumerator as number,
      secondDenominator: value.secondDenominator as number,
      studentNumerator: value.studentNumerator as number,
      studentDenominator: value.studentDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
