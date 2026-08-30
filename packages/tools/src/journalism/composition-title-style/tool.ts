import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly compositionTitle: string;
  readonly renderedTitle: string;
  readonly requiredTreatment: string;
}>;
export type Output = Readonly<{
  readonly expectedTitle: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const title = input.compositionTitle.trim();
  if (!title)
    simpleError("compositionTitle", "Title must not be blank.", "blank_title");
  const expectedTitle =
    input.requiredTreatment === "quotes"
      ? `“${title}”`
      : input.requiredTreatment === "italics"
        ? `<i>${title}</i>`
        : title;
  return {
    expectedTitle,
    matchesExpected: input.renderedTitle.trim() === expectedTitle,
  };
};

export const exampleInput = {
  compositionTitle: "Moonlight Sonata",
  renderedTitle: "<i>Moonlight Sonata</i>",
  requiredTreatment: "italics",
} satisfies Input;
export const exampleOutput = {
  expectedTitle: "<i>Moonlight Sonata</i>",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      compositionTitle: input.compositionTitle as string,
      renderedTitle: input.renderedTitle as string,
      requiredTreatment: input.requiredTreatment as string,
    }),
  description:
    "Validate a composition title against a supplied typographic treatment.",
  id: "journalism/composition-title-style",
  inputs: [
    { id: "compositionTitle", label: "Composition title", kind: "string" },
    { id: "renderedTitle", label: "Rendered title", kind: "string" },
    {
      id: "requiredTreatment",
      label: "Required treatment",
      kind: "string",
      enum: ["quotes", "italics", "plain"],
    },
  ],
  outputs: [
    { id: "expectedTitle", label: "Expected styled title", kind: "string" },
    {
      id: "matchesExpected",
      label: "Matches expected treatment",
      kind: "boolean",
    },
  ],
  title: "Composition Title Style",
});

export const run = tool.execute;
export default tool;
