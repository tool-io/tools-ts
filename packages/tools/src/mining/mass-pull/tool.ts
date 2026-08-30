import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly concentrateWetTonnes: number;
  readonly concentrateMoistureFraction: number;
  readonly feedWetTonnes: number;
  readonly feedMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly concentrateDryTonnes: number;
  readonly feedDryTonnes: number;
  readonly dryMassPullPercent: number;
}>;
const inputFields = [
  {
    id: "concentrateWetTonnes",
    label: "Concentrate wet tonnes",
    kind: "number",
  },
  {
    id: "concentrateMoistureFraction",
    label: "Concentrate moisture fraction",
    kind: "number",
  },
  { id: "feedWetTonnes", label: "Feed wet tonnes", kind: "number" },
  {
    id: "feedMoistureFraction",
    label: "Feed moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedWetTonnes, "feedWetTonnes");
  nonnegative(input.concentrateWetTonnes, "concentrateWetTonnes");
  fraction(input.concentrateMoistureFraction, "concentrateMoistureFraction");
  fraction(input.feedMoistureFraction, "feedMoistureFraction");
  const concentrateDryTonnes =
      input.concentrateWetTonnes * (1 - input.concentrateMoistureFraction),
    feedDryTonnes = positive(
      input.feedWetTonnes * (1 - input.feedMoistureFraction),
      "feedMoistureFraction",
    );
  fraction(concentrateDryTonnes / feedDryTonnes, "concentrateWetTonnes");
  return {
    concentrateDryTonnes,
    feedDryTonnes,
    dryMassPullPercent: (100 * concentrateDryTonnes) / feedDryTonnes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  concentrateWetTonnes: 20,
  concentrateMoistureFraction: 0.25,
  feedWetTonnes: 125,
  feedMoistureFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  concentrateDryTonnes: 15,
  feedDryTonnes: 100,
  dryMassPullPercent: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mass-pull",
  title: "Mass Pull",
  description:
    "Calculate dry mass pull from separate wet masses and moisture assays; unlike assay-inferred concentration ratio, this uses measured moisture-corrected quantities.",
  inputs: inputFields,
  outputs: [
    {
      id: "concentrateDryTonnes",
      label: "Concentrate dry tonnes",
      kind: "number",
    },
    { id: "feedDryTonnes", label: "Feed dry tonnes", kind: "number" },
    {
      id: "dryMassPullPercent",
      label: "Dry mass pull percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      concentrateWetTonnes: value.concentrateWetTonnes as number,
      concentrateMoistureFraction: value.concentrateMoistureFraction as number,
      feedWetTonnes: value.feedWetTonnes as number,
      feedMoistureFraction: value.feedMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
