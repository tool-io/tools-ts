import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly stainOds: readonly number[];
  readonly blankOd: number;
  readonly planktonicBiomassOds: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedStainOds: readonly number[];
  readonly adhesionIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.stainOds, input.planktonicBiomassOds, "stainOds");
  nonnegative(input.blankOd, "blankOd");
  input.stainOds.forEach((v) => nonnegative(v, "stainOds"));
  input.planktonicBiomassOds.forEach((v) =>
    positive(v, "planktonicBiomassOds"),
  );
  const correctedStainOds = input.stainOds.map((v) =>
    Math.max(0, v - input.blankOd),
  );
  return {
    correctedStainOds,
    adhesionIndexes: correctedStainOds.map(
      (v, i) => v / input.planktonicBiomassOds[i],
    ),
  };
};
export const exampleInput = {
  stainOds: [0.5, 0.9],
  blankOd: 0.1,
  planktonicBiomassOds: [0.2, 0.4],
} satisfies Input;
export const exampleOutput = {
  correctedStainOds: [0.4, 0.8],
  adhesionIndexes: [2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/biofilm-biomass-normalized-adhesion",
  title: "Biofilm Biomass Normalized Adhesion",
  description:
    "Normalize blank-corrected crystal-violet stain OD by matched biomass OD to compare adhesion among cultures.",
  inputs: [
    { id: "stainOds", label: "Stain ods", kind: "numberList" },
    { id: "blankOd", label: "Blank od", kind: "number", minimum: 0 },
    {
      id: "planktonicBiomassOds",
      label: "Planktonic biomass ods",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "correctedStainOds",
      label: "Corrected stain ods",
      kind: "numberList",
    },
    { id: "adhesionIndexes", label: "Adhesion indexes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      stainOds: value.stainOds as readonly number[],
      blankOd: value.blankOd as number,
      planktonicBiomassOds: value.planktonicBiomassOds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
