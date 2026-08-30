import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly religiousTitle: string;
  readonly personName: string;
  readonly renderedReference: string;
  readonly includeTitle: boolean;
}>;
export type Output = Readonly<{
  readonly expectedReference: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const name = input.personName.trim();
  if (!name)
    simpleError("personName", "Person name must not be blank.", "blank_name");
  const expectedReference = input.includeTitle
    ? `${input.religiousTitle.trim()} ${name}`.trim()
    : name;
  return {
    expectedReference,
    matchesExpected: input.renderedReference.trim() === expectedReference,
  };
};

export const exampleInput = {
  religiousTitle: "Rabbi",
  personName: "Avery Cohen",
  renderedReference: "Rabbi Avery Cohen",
  includeTitle: true,
} satisfies Input;
export const exampleOutput = {
  expectedReference: "Rabbi Avery Cohen",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      religiousTitle: input.religiousTitle as string,
      personName: input.personName as string,
      renderedReference: input.renderedReference as string,
      includeTitle: input.includeTitle as boolean,
    }),
  description:
    "Validate a religious-title reference against supplied title-use policy.",
  id: "journalism/religious-title-style",
  inputs: [
    { id: "religiousTitle", label: "Religious title", kind: "string" },
    { id: "personName", label: "Person name", kind: "string" },
    { id: "renderedReference", label: "Rendered reference", kind: "string" },
    { id: "includeTitle", label: "Include title", kind: "boolean" },
  ],
  outputs: [
    { id: "expectedReference", label: "Expected reference", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected reference",
      kind: "boolean",
    },
  ],
  title: "Religious Title Style",
});

export const run = tool.execute;
export default tool;
