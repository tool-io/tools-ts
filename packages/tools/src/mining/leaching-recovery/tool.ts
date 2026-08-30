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
  readonly initialDryOreTonnes: number;
  readonly initialAssayFraction: number;
  readonly residueDryTonnes: number;
  readonly residueAssayFraction: number;
}>;
export type Output = Readonly<{
  readonly initialMetalTonnes: number;
  readonly residueMetalTonnes: number;
  readonly leachedMetalTonnes: number;
  readonly leachingRecoveryFraction: number;
}>;
const inputFields = [
  {
    id: "initialDryOreTonnes",
    label: "Initial dry ore tonnes",
    kind: "number",
  },
  {
    id: "initialAssayFraction",
    label: "Initial assay fraction",
    kind: "number",
  },
  { id: "residueDryTonnes", label: "Residue dry tonnes", kind: "number" },
  {
    id: "residueAssayFraction",
    label: "Residue assay fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialDryOreTonnes, "initialDryOreTonnes");
  positive(input.initialAssayFraction, "initialAssayFraction");
  nonnegative(input.residueDryTonnes, "residueDryTonnes");
  fraction(input.initialAssayFraction, "initialAssayFraction");
  fraction(input.residueAssayFraction, "residueAssayFraction");
  const initialMetalTonnes =
      input.initialDryOreTonnes * input.initialAssayFraction,
    residueMetalTonnes = input.residueDryTonnes * input.residueAssayFraction,
    leachingRecoveryFraction = fraction(
      1 - residueMetalTonnes / initialMetalTonnes,
      "residueAssayFraction",
    );
  return {
    initialMetalTonnes,
    residueMetalTonnes,
    leachedMetalTonnes: initialMetalTonnes - residueMetalTonnes,
    leachingRecoveryFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialDryOreTonnes: 100,
  initialAssayFraction: 0.05,
  residueDryTonnes: 80,
  residueAssayFraction: 0.01,
} satisfies Input;
export const exampleOutput = {
  initialMetalTonnes: 5,
  residueMetalTonnes: 0.8,
  leachedMetalTonnes: 4.2,
  leachingRecoveryFraction: 0.84,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/leaching-recovery",
  title: "Leaching Recovery",
  description:
    "Infer leached metal from ore and changing residue mass/assay; accounts for mass loss with matched dry samples.",
  inputs: inputFields,
  outputs: [
    { id: "initialMetalTonnes", label: "Initial metal tonnes", kind: "number" },
    { id: "residueMetalTonnes", label: "Residue metal tonnes", kind: "number" },
    { id: "leachedMetalTonnes", label: "Leached metal tonnes", kind: "number" },
    {
      id: "leachingRecoveryFraction",
      label: "Leaching recovery fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialDryOreTonnes: value.initialDryOreTonnes as number,
      initialAssayFraction: value.initialAssayFraction as number,
      residueDryTonnes: value.residueDryTonnes as number,
      residueAssayFraction: value.residueAssayFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
