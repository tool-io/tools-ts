import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transcribedName: string;
  readonly referenceName: string;
  readonly maximumEditDistance: number;
}>;
export type Output = Readonly<{
  readonly editDistance: number;
  readonly similarityPercent: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = [...input.transcribedName.trim().toLowerCase()],
    b = [...input.referenceName.trim().toLowerCase()];
  if (a.length === 0 || b.length === 0)
    simpleError("transcribedName", "Names must not be blank.", "blank_name");
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1)
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  const editDistance = previous[b.length];
  return {
    editDistance,
    similarityPercent: (1 - editDistance / Math.max(a.length, b.length)) * 100,
    withinTolerance: editDistance <= input.maximumEditDistance,
  };
};

export const exampleInput = {
  transcribedName: "Jon Smyth",
  referenceName: "John Smith",
  maximumEditDistance: 2,
} satisfies Input;
export const exampleOutput = {
  editDistance: 2,
  similarityPercent: 80,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transcribedName: input.transcribedName as string,
      referenceName: input.referenceName as string,
      maximumEditDistance: input.maximumEditDistance as number,
    }),
  description:
    "Compare a transcribed name with a reference using edit distance.",
  id: "journalism/transcription-name-match",
  inputs: [
    { id: "transcribedName", label: "Transcribed name", kind: "string" },
    { id: "referenceName", label: "Reference name", kind: "string" },
    {
      id: "maximumEditDistance",
      label: "Maximum edit distance",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "editDistance",
      label: "Levenshtein edit distance",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "similarityPercent",
      label: "Name similarity",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "withinTolerance",
      label: "Within supplied distance",
      kind: "boolean",
    },
  ],
  title: "Transcription Name Match",
});

export const run = tool.execute;
export default tool;
