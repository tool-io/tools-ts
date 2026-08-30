import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fullRank: string;
  readonly abbreviatedRank: string;
  readonly personName: string;
  readonly renderedReference: string;
  readonly useAbbreviation: boolean;
}>;
export type Output = Readonly<{
  readonly expectedReference: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const rank = (
    input.useAbbreviation ? input.abbreviatedRank : input.fullRank
  ).trim();
  if (!rank || !input.personName.trim())
    simpleError(
      "fullRank",
      "Rank and person name must not be blank.",
      "blank_reference",
    );
  const expectedReference = `${rank} ${input.personName.trim()}`;
  return {
    expectedReference,
    matchesExpected: input.renderedReference.trim() === expectedReference,
  };
};

export const exampleInput = {
  fullRank: "General",
  abbreviatedRank: "Gen.",
  personName: "Avery Lee",
  renderedReference: "Gen. Avery Lee",
  useAbbreviation: true,
} satisfies Input;
export const exampleOutput = {
  expectedReference: "Gen. Avery Lee",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fullRank: input.fullRank as string,
      abbreviatedRank: input.abbreviatedRank as string,
      personName: input.personName as string,
      renderedReference: input.renderedReference as string,
      useAbbreviation: input.useAbbreviation as boolean,
    }),
  description:
    "Validate a military-rank reference against supplied full or abbreviated form.",
  id: "journalism/military-rank-style",
  inputs: [
    { id: "fullRank", label: "Full military rank", kind: "string" },
    { id: "abbreviatedRank", label: "Abbreviated rank", kind: "string" },
    { id: "personName", label: "Person name", kind: "string" },
    { id: "renderedReference", label: "Rendered reference", kind: "string" },
    { id: "useAbbreviation", label: "Use abbreviated rank", kind: "boolean" },
  ],
  outputs: [
    { id: "expectedReference", label: "Expected reference", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected reference",
      kind: "boolean",
    },
  ],
  title: "Military Rank Style",
});

export const run = tool.execute;
export default tool;
