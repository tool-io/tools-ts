import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstName: string;
  readonly secondName: string;
  readonly matchThresholdPercent: number;
}>;
export type Output = Readonly<{
  readonly editDistance: number;
  readonly similarityPercent: number;
  readonly matches: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = [...input.firstName.trim().toLowerCase()],
    b = [...input.secondName.trim().toLowerCase()];
  if (a.length === 0 || b.length === 0)
    simpleError("firstName", "Names must not be blank.", "blank_name");
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1)
      next[j] = Math.min(
        next[j - 1] + 1,
        row[j] + 1,
        row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    row = next;
  }
  const editDistance = row[b.length],
    similarityPercent = (1 - editDistance / Math.max(a.length, b.length)) * 100;
  return {
    editDistance,
    similarityPercent,
    matches: similarityPercent >= input.matchThresholdPercent,
  };
};

export const exampleInput = {
  firstName: "Katherine Johnson",
  secondName: "Kathrine Johnson",
  matchThresholdPercent: 90,
} satisfies Input;
export const exampleOutput = {
  editDistance: 1,
  similarityPercent: 94.11764705882352,
  matches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstName: input.firstName as string,
      secondName: input.secondName as string,
      matchThresholdPercent: input.matchThresholdPercent as number,
    }),
  description:
    "Fuzzy-match two names with a caller-supplied similarity threshold.",
  id: "journalism/fuzzy-name-match",
  inputs: [
    { id: "firstName", label: "First name", kind: "string" },
    { id: "secondName", label: "Second name", kind: "string" },
    {
      id: "matchThresholdPercent",
      label: "Match threshold",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    { id: "editDistance", label: "Edit distance", kind: "integer", minimum: 0 },
    {
      id: "similarityPercent",
      label: "Similarity",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "matches", label: "Meets supplied threshold", kind: "boolean" },
  ],
  title: "Fuzzy Name Match",
});

export const run = tool.execute;
export default tool;
