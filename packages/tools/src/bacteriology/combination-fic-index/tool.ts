import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly aloneMicA: number;
  readonly aloneMicB: number;
  readonly combinationConcentrationA: number;
  readonly combinationConcentrationB: number;
  readonly synergyMaximum: number;
  readonly antagonismAbove: number;
}>;
export type Output = Readonly<{
  readonly ficA: number;
  readonly ficB: number;
  readonly ficIndex: number;
  readonly suppliedInterpretation: string;
}>;
export const calculate = (input: Input): Output => {
  positive(input.aloneMicA, "aloneMicA");
  positive(input.aloneMicB, "aloneMicB");
  nonnegative(input.combinationConcentrationA, "combinationConcentrationA");
  nonnegative(input.combinationConcentrationB, "combinationConcentrationB");
  nonnegative(input.synergyMaximum, "synergyMaximum");
  if (input.antagonismAbove <= input.synergyMaximum)
    simpleError(
      "antagonismAbove",
      "Interpretation boundaries must be ordered.",
    );
  const ficA = input.combinationConcentrationA / input.aloneMicA,
    ficB = input.combinationConcentrationB / input.aloneMicB,
    ficIndex = ficA + ficB;
  return {
    ficA,
    ficB,
    ficIndex,
    suppliedInterpretation:
      ficIndex <= input.synergyMaximum
        ? "synergy"
        : ficIndex > input.antagonismAbove
          ? "antagonism"
          : "between-cutoffs",
  };
};
export const exampleInput = {
  aloneMicA: 1,
  aloneMicB: 2,
  combinationConcentrationA: 0.25,
  combinationConcentrationB: 0.5,
  synergyMaximum: 0.5,
  antagonismAbove: 4,
} satisfies Input;
export const exampleOutput = {
  ficA: 0.25,
  ficB: 0.25,
  ficIndex: 0.5,
  suppliedInterpretation: "synergy",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/combination-fic-index",
  title: "Combination FIC Index",
  description:
    "Compute checkerboard FIC components and apply caller-provided interpretation cutoffs; results are assay-specific, not a treatment recommendation.",
  inputs: [
    { id: "aloneMicA", label: "Alone mic a", kind: "number" },
    { id: "aloneMicB", label: "Alone mic b", kind: "number" },
    {
      id: "combinationConcentrationA",
      label: "Combination concentration a",
      kind: "number",
      minimum: 0,
    },
    {
      id: "combinationConcentrationB",
      label: "Combination concentration b",
      kind: "number",
      minimum: 0,
    },
    {
      id: "synergyMaximum",
      label: "Synergy maximum",
      kind: "number",
      minimum: 0,
    },
    { id: "antagonismAbove", label: "Antagonism above", kind: "number" },
  ],
  outputs: [
    { id: "ficA", label: "Fic a", kind: "number" },
    { id: "ficB", label: "Fic b", kind: "number" },
    { id: "ficIndex", label: "Fic index", kind: "number" },
    {
      id: "suppliedInterpretation",
      label: "Supplied interpretation",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      aloneMicA: value.aloneMicA as number,
      aloneMicB: value.aloneMicB as number,
      combinationConcentrationA: value.combinationConcentrationA as number,
      combinationConcentrationB: value.combinationConcentrationB as number,
      synergyMaximum: value.synergyMaximum as number,
      antagonismAbove: value.antagonismAbove as number,
    }),
});
export const run = tool.execute;
export default tool;
