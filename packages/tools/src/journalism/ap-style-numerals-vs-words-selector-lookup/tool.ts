import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedNonnegativeInteger: number;
  readonly callerContext: string;
}>;
export type Output = Readonly<{ readonly basicApRenderedNumber: string }>;
const inputFields = [
  {
    id: "observedNonnegativeInteger",
    label: "Observed nonnegative integer",
    kind: "number",
  },
  { id: "callerContext", label: "Caller context", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedNonnegativeInteger, "number", 0, 1000000);
  const n = input.observedNonnegativeInteger,
    c = input.callerContext;
  pick(
    c,
    { general: 0, age: 1, percentage: 2, measurement: 3, year: 4 },
    "context",
  );
  return {
    basicApRenderedNumber:
      c === "general" && n < 10
        ? [
            "zero",
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
          ][n]
        : String(n),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNonnegativeInteger: 7,
  callerContext: "age",
} satisfies Input;
export const exampleOutput = { basicApRenderedNumber: "7" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/ap-style-numerals-vs-words-selector-lookup",
  title: "AP Style Numerals vs Words Selector Lookup",
  description:
    "Bounded basic AP integer rule: general zero–nine words, age/percent/measurement/year numeral exceptions; caller chooses correct context/edition, not full AP fractions, sentence starts or phrase parser. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "basicApRenderedNumber",
      label: "Basic ap rendered number",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNonnegativeInteger: value.observedNonnegativeInteger as number,
      callerContext: value.callerContext as string,
    }),
});
export const run = tool.execute;
export default tool;
