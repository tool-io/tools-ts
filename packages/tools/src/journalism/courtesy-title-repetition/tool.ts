import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly copy: string;
  readonly courtesyTitles: readonly string[];
  readonly maximumOccurrences: number;
}>;
export type Output = Readonly<{
  readonly occurrenceCount: number;
  readonly repeatedTitles: readonly string[];
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const copy = input.copy.toLowerCase();
  const counts = input.courtesyTitles.map((title) => {
    const needle = title.toLowerCase();
    if (!needle)
      simpleError(
        "courtesyTitles",
        "Courtesy titles must not be blank.",
        "blank_title",
      );
    let count = 0;
    let index = 0;
    while ((index = copy.indexOf(needle, index)) >= 0) {
      count += 1;
      index += needle.length;
    }
    return { title, count };
  });
  const occurrenceCount = counts.reduce((sum, item) => sum + item.count, 0);
  return {
    occurrenceCount,
    repeatedTitles: counts
      .filter((item) => item.count > 1)
      .map((item) => item.title),
    withinLimit: occurrenceCount <= input.maximumOccurrences,
  };
};

export const exampleInput = {
  copy: "Dr. Lee met Dr. Jones.",
  courtesyTitles: ["Dr.", "Mr."],
  maximumOccurrences: 2,
} satisfies Input;
export const exampleOutput = {
  occurrenceCount: 2,
  repeatedTitles: ["Dr."],
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      copy: input.copy as string,
      courtesyTitles: input.courtesyTitles as readonly string[],
      maximumOccurrences: input.maximumOccurrences as number,
    }),
  description:
    "Count repeated courtesy titles in copy against a supplied limit.",
  id: "journalism/courtesy-title-repetition",
  inputs: [
    { id: "copy", label: "Copy to inspect", kind: "string" },
    {
      id: "courtesyTitles",
      label: "Courtesy titles to count",
      kind: "stringList",
    },
    {
      id: "maximumOccurrences",
      label: "Maximum allowed occurrences",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "occurrenceCount",
      label: "Courtesy-title occurrences",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "repeatedTitles",
      label: "Titles exceeding one occurrence",
      kind: "stringList",
    },
    {
      id: "withinLimit",
      label: "Within supplied occurrence limit",
      kind: "boolean",
    },
  ],
  title: "Courtesy Title Repetition",
});

export const run = tool.execute;
export default tool;
