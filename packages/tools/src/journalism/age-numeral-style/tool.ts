import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly age: number;
  readonly usedAsModifier: boolean;
  readonly renderedAge: string;
}>;
export type Output = Readonly<{
  readonly expectedAge: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const expectedAge = input.usedAsModifier
    ? `${input.age}-year-old`
    : `${input.age} years old`;
  return {
    expectedAge,
    matchesExpected: input.renderedAge.trim() === expectedAge,
  };
};

export const exampleInput = {
  age: 9,
  usedAsModifier: true,
  renderedAge: "9-year-old",
} satisfies Input;
export const exampleOutput = {
  expectedAge: "9-year-old",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      age: input.age as number,
      usedAsModifier: input.usedAsModifier as boolean,
      renderedAge: input.renderedAge as string,
    }),
  description: "Validate numeral and hyphenation style for an age expression.",
  id: "journalism/age-numeral-style",
  inputs: [
    { id: "age", label: "Age", kind: "integer", minimum: 0 },
    { id: "usedAsModifier", label: "Age used as a modifier", kind: "boolean" },
    { id: "renderedAge", label: "Rendered age", kind: "string" },
  ],
  outputs: [
    { id: "expectedAge", label: "Expected age expression", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected expression",
      kind: "boolean",
    },
  ],
  title: "Age Numeral Style",
});

export const run = tool.execute;
export default tool;
