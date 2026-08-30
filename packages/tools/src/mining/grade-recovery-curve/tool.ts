import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly feedTonnes: number;
  readonly feedGradeFraction: number;
  readonly concentrateTonnes: readonly number[];
  readonly concentrateGradeFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly massPullFractions: readonly number[];
  readonly metalRecoveryFractions: readonly number[];
  readonly enrichmentRatios: readonly number[];
}>;
const inputFields = [
  { id: "feedTonnes", label: "Feed tonnes", kind: "number" },
  { id: "feedGradeFraction", label: "Feed grade fraction", kind: "number" },
  { id: "concentrateTonnes", label: "Concentrate tonnes", kind: "numberList" },
  {
    id: "concentrateGradeFractions",
    label: "Concentrate grade fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedTonnes, "feedTonnes");
  positive(input.feedGradeFraction, "feedGradeFraction");
  input.concentrateTonnes.forEach((v) => nonnegative(v, "concentrateTonnes"));
  fraction(input.feedGradeFraction, "feedGradeFraction");
  input.concentrateGradeFractions.forEach((v) =>
    fraction(v, "concentrateGradeFractions"),
  );
  aligned(
    input.concentrateTonnes,
    input.concentrateGradeFractions,
    "concentrateTonnes",
  );
  const massPullFractions = input.concentrateTonnes.map((v) =>
      fraction(v / input.feedTonnes, "concentrateTonnes"),
    ),
    metalRecoveryFractions = massPullFractions.map((v, i) =>
      fraction(
        (v * input.concentrateGradeFractions[i]) / input.feedGradeFraction,
        "concentrateGradeFractions",
      ),
    );
  return {
    massPullFractions,
    metalRecoveryFractions,
    enrichmentRatios: input.concentrateGradeFractions.map(
      (v) => v / input.feedGradeFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedTonnes: 100,
  feedGradeFraction: 0.1,
  concentrateTonnes: [10, 20],
  concentrateGradeFractions: [0.8, 0.45],
} satisfies Input;
export const exampleOutput = {
  massPullFractions: [0.1, 0.2],
  metalRecoveryFractions: [0.8, 0.9],
  enrichmentRatios: [8, 4.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/grade-recovery-curve",
  title: "Grade Recovery Curve",
  description:
    "Build observed grade/recovery operating points from matched concentrate masses and assay fractions; points are separate trials, not additive products or a fitted optimization curve.",
  inputs: inputFields,
  outputs: [
    {
      id: "massPullFractions",
      label: "Mass pull fractions",
      kind: "numberList",
    },
    {
      id: "metalRecoveryFractions",
      label: "Metal recovery fractions",
      kind: "numberList",
    },
    { id: "enrichmentRatios", label: "Enrichment ratios", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      feedTonnes: value.feedTonnes as number,
      feedGradeFraction: value.feedGradeFraction as number,
      concentrateTonnes: value.concentrateTonnes as readonly number[],
      concentrateGradeFractions:
        value.concentrateGradeFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
