import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstLine: string;
  readonly secondLine: string;
  readonly maximumCharactersPerLine: number;
  readonly maximumTotalCharacters: number;
}>;
export type Output = Readonly<{
  readonly firstLineCharacters: number;
  readonly secondLineCharacters: number;
  readonly totalCharacters: number;
  readonly fits: boolean;
}>;

export const calculate = (input: Input): Output => {
  const firstLineCharacters = [...input.firstLine].length,
    secondLineCharacters = [...input.secondLine].length,
    totalCharacters = firstLineCharacters + secondLineCharacters;
  return {
    firstLineCharacters,
    secondLineCharacters,
    totalCharacters,
    fits:
      firstLineCharacters <= input.maximumCharactersPerLine &&
      secondLineCharacters <= input.maximumCharactersPerLine &&
      totalCharacters <= input.maximumTotalCharacters,
  };
};

export const exampleInput = {
  firstLine: "Jane Doe",
  secondLine: "City Council",
  maximumCharactersPerLine: 20,
  maximumTotalCharacters: 30,
} satisfies Input;
export const exampleOutput = {
  firstLineCharacters: 8,
  secondLineCharacters: 12,
  totalCharacters: 20,
  fits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstLine: input.firstLine as string,
      secondLine: input.secondLine as string,
      maximumCharactersPerLine: input.maximumCharactersPerLine as number,
      maximumTotalCharacters: input.maximumTotalCharacters as number,
    }),
  description: "Check lower-third line and total character limits.",
  id: "journalism/lower-third-fit",
  inputs: [
    { id: "firstLine", label: "First lower-third line", kind: "string" },
    { id: "secondLine", label: "Second lower-third line", kind: "string" },
    {
      id: "maximumCharactersPerLine",
      label: "Maximum characters per line",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "maximumTotalCharacters",
      label: "Maximum total characters",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "firstLineCharacters",
      label: "First-line characters",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "secondLineCharacters",
      label: "Second-line characters",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalCharacters",
      label: "Total characters",
      kind: "integer",
      minimum: 0,
    },
    { id: "fits", label: "Fits supplied limits", kind: "boolean" },
  ],
  title: "Lower-Third Fit",
});

export const run = tool.execute;
export default tool;
