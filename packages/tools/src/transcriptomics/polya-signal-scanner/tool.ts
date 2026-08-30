import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rnaSequence: string;
  readonly cleavageIndex: number;
  readonly minimumDistance: number;
  readonly maximumDistance: number;
}>;
export type Output = Readonly<{
  readonly motifStart: number;
  readonly distanceToCleavage: number;
  readonly withinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  const s = input.rnaSequence.toUpperCase().replace(/T/g, "U");
  if (
    !/^[ACGU]+$/.test(s) ||
    input.cleavageIndex < 0 ||
    input.cleavageIndex > s.length ||
    input.minimumDistance < 0 ||
    input.maximumDistance < input.minimumDistance
  )
    simpleError(
      "rnaSequence",
      "Valid RNA, cleavage index and ordered distance window are required.",
    );
  const motifStart = s.lastIndexOf("AAUAAA", input.cleavageIndex - 6);
  if (motifStart < 0)
    simpleError("rnaSequence", "No upstream AAUAAA signal found.");
  const distanceToCleavage = input.cleavageIndex - (motifStart + 6);
  return {
    motifStart,
    distanceToCleavage,
    withinWindow:
      distanceToCleavage >= input.minimumDistance &&
      distanceToCleavage <= input.maximumDistance,
  };
};

export const exampleInput = {
  rnaSequence: "AAUAAAACCC",
  cleavageIndex: 10,
  minimumDistance: 0,
  maximumDistance: 20,
} satisfies Input;
export const exampleOutput = {
  motifStart: 0,
  distanceToCleavage: 4,
  withinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/polya-signal-scanner",
  title: "Polya Signal Scanner",
  description:
    "Find an upstream AAUAAA polyadenylation signal and cleavage-site spacing.",
  inputs: [
    { id: "rnaSequence", kind: "string", label: "RNA sequence" },
    { id: "cleavageIndex", kind: "number", label: "Cleavage index" },
    { id: "minimumDistance", kind: "number", label: "Minimum distance" },
    { id: "maximumDistance", kind: "number", label: "Maximum distance" },
  ],
  outputs: [
    { id: "motifStart", kind: "number", label: "Motif start" },
    {
      id: "distanceToCleavage",
      kind: "number",
      label: "Distance to cleavage",
    },
    { id: "withinWindow", kind: "boolean", label: "Within window" },
  ],
  calculate: (value) =>
    calculate({
      rnaSequence: value.rnaSequence as string,
      cleavageIndex: value.cleavageIndex as number,
      minimumDistance: value.minimumDistance as number,
      maximumDistance: value.maximumDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
