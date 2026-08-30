import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly biologicalYearsElapsed: number;
  readonly chronologicalYearsElapsed: number;
  readonly referencePace: number;
}>;
export type Output = Readonly<{
  readonly paceRatio: number;
  readonly relativePace: number;
  readonly fasterThanReference: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.chronologicalYearsElapsed <= 0 ||
    input.referencePace <= 0 ||
    input.biologicalYearsElapsed < 0
  )
    simpleError(
      "chronologicalYearsElapsed",
      "Elapsed time and reference pace must be positive.",
    );
  const paceRatio =
    input.biologicalYearsElapsed / input.chronologicalYearsElapsed;
  return {
    paceRatio,
    relativePace: paceRatio / input.referencePace,
    fasterThanReference: paceRatio > input.referencePace,
  };
};

export const exampleInput = {
  biologicalYearsElapsed: 12,
  chronologicalYearsElapsed: 10,
  referencePace: 1,
} satisfies Input;
export const exampleOutput = {
  paceRatio: 1.2,
  relativePace: 1.2,
  fasterThanReference: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/dunedinpace-ratio",
  title: "DunedinPACE Ratio",
  description:
    "Compare a measured epigenetic pace of aging to an injected reference pace.",
  inputs: [
    {
      id: "biologicalYearsElapsed",
      kind: "number",
      label: "Biological years elapsed",
    },
    {
      id: "chronologicalYearsElapsed",
      kind: "number",
      label: "Chronological years elapsed",
    },
    { id: "referencePace", kind: "number", label: "Reference pace" },
  ],
  outputs: [
    { id: "paceRatio", kind: "number", label: "Pace ratio" },
    { id: "relativePace", kind: "number", label: "Relative pace" },
    {
      id: "fasterThanReference",
      kind: "boolean",
      label: "Faster than reference",
    },
  ],
  calculate: (value) =>
    calculate({
      biologicalYearsElapsed: value.biologicalYearsElapsed as number,
      chronologicalYearsElapsed: value.chronologicalYearsElapsed as number,
      referencePace: value.referencePace as number,
    }),
});
export const run = tool.execute;
export default tool;
