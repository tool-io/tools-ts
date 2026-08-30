import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly treatedDead: number;
  readonly treatedExposed: number;
  readonly controlDead: number;
  readonly controlExposed: number;
  readonly minimumCorrectedMortality: number;
}>;
export type Output = Readonly<{
  readonly rawMortalityFraction: number;
  readonly controlMortalityFraction: number;
  readonly correctedMortalityFraction: number;
  readonly meetsSuppliedCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.treatedDead, "treatedDead");
  count(input.treatedExposed, "treatedExposed", 1);
  count(input.controlDead, "controlDead");
  count(input.controlExposed, "controlExposed", 1);
  fraction(input.minimumCorrectedMortality, "minimumCorrectedMortality");
  if (
    input.treatedDead > input.treatedExposed ||
    input.controlDead >= input.controlExposed
  )
    simpleError(
      "controlDead",
      "Deaths must fit assay totals and control mortality must be below one.",
    );
  const rawMortalityFraction = input.treatedDead / input.treatedExposed,
    controlMortalityFraction = input.controlDead / input.controlExposed,
    correctedMortalityFraction = Math.max(
      0,
      (rawMortalityFraction - controlMortalityFraction) /
        (1 - controlMortalityFraction),
    );
  return {
    rawMortalityFraction,
    controlMortalityFraction,
    correctedMortalityFraction,
    meetsSuppliedCriterion:
      correctedMortalityFraction >= input.minimumCorrectedMortality,
  };
};
export const exampleInput = {
  treatedDead: 90,
  treatedExposed: 100,
  controlDead: 10,
  controlExposed: 100,
  minimumCorrectedMortality: 0.8,
} satisfies Input;
export const exampleOutput = {
  rawMortalityFraction: 0.9,
  controlMortalityFraction: 0.1,
  correctedMortalityFraction: 0.8888888888888888,
  meetsSuppliedCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/cone-bioassay-mortality",
  title: "Cone Bioassay Mortality",
  description:
    "Compute Abbott-corrected cone-bioassay mortality and compare with a caller-defined criterion.",
  inputs: [
    { id: "treatedDead", label: "Treated dead", kind: "integer" },
    { id: "treatedExposed", label: "Treated exposed", kind: "integer" },
    { id: "controlDead", label: "Control dead", kind: "integer" },
    { id: "controlExposed", label: "Control exposed", kind: "integer" },
    {
      id: "minimumCorrectedMortality",
      label: "Minimum corrected mortality",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "rawMortalityFraction",
      label: "Raw mortality fraction",
      kind: "number",
    },
    {
      id: "controlMortalityFraction",
      label: "Control mortality fraction",
      kind: "number",
    },
    {
      id: "correctedMortalityFraction",
      label: "Corrected mortality fraction",
      kind: "number",
    },
    {
      id: "meetsSuppliedCriterion",
      label: "Meets supplied criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      treatedDead: value.treatedDead as number,
      treatedExposed: value.treatedExposed as number,
      controlDead: value.controlDead as number,
      controlExposed: value.controlExposed as number,
      minimumCorrectedMortality: value.minimumCorrectedMortality as number,
    }),
});
export const run = tool.execute;
export default tool;
