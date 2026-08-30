import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly royalTitle: string;
  readonly personName: string;
  readonly renderedReference: string;
  readonly titleRequired: boolean;
}>;
export type Output = Readonly<{
  readonly expectedReference: string;
  readonly matchesExpected: boolean;
  readonly titleOccurrenceCount: number;
}>;

export const calculate = (input: Input): Output => {
  const title = input.royalTitle.trim(),
    name = input.personName.trim();
  if (!name)
    simpleError("personName", "Person name must not be blank.", "blank_name");
  const expectedReference = input.titleRequired
    ? `${title} ${name}`.trim()
    : name;
  const titleOccurrenceCount = title
    ? input.renderedReference.split(title).length - 1
    : 0;
  return {
    expectedReference,
    matchesExpected: input.renderedReference.trim() === expectedReference,
    titleOccurrenceCount,
  };
};

export const exampleInput = {
  royalTitle: "King",
  personName: "Charles III",
  renderedReference: "King Charles III",
  titleRequired: true,
} satisfies Input;
export const exampleOutput = {
  expectedReference: "King Charles III",
  matchesExpected: true,
  titleOccurrenceCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      royalTitle: input.royalTitle as string,
      personName: input.personName as string,
      renderedReference: input.renderedReference as string,
      titleRequired: input.titleRequired as boolean,
    }),
  description:
    "Validate a rendered royal reference against supplied title-use policy.",
  id: "journalism/royalty-title-style",
  inputs: [
    { id: "royalTitle", label: "Royal title", kind: "string" },
    { id: "personName", label: "Person name", kind: "string" },
    { id: "renderedReference", label: "Rendered reference", kind: "string" },
    {
      id: "titleRequired",
      label: "Title required on this reference",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "expectedReference", label: "Expected reference", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected reference",
      kind: "boolean",
    },
    {
      id: "titleOccurrenceCount",
      label: "Title occurrence count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Royalty Title Style",
});

export const run = tool.execute;
export default tool;
