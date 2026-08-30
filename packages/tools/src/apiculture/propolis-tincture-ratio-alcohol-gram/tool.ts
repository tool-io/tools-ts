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
  readonly dryPropolisGrams: number;
  readonly solventMassGrams: number;
  readonly solventEthanolMassFraction: number;
  readonly extractableDryFraction: number;
  readonly solventRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly expectedExtractSolidsGrams: number;
  readonly expectedFiltrateMassGrams: number;
  readonly filtrateSolidsMassFraction: number;
  readonly filtrateEthanolMassFraction: number;
}>;
const inputFields = [
  { id: "dryPropolisGrams", label: "Dry propolis grams", kind: "number" },
  { id: "solventMassGrams", label: "Solvent mass grams", kind: "number" },
  {
    id: "solventEthanolMassFraction",
    label: "Solvent ethanol mass fraction",
    kind: "number",
  },
  {
    id: "extractableDryFraction",
    label: "Extractable dry fraction",
    kind: "number",
  },
  {
    id: "solventRecoveryFraction",
    label: "Solvent recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.dryPropolisGrams, "dryPropolisGrams");
  nonnegative(input.solventMassGrams, "solventMassGrams");
  fraction(input.solventEthanolMassFraction, "solventEthanolMassFraction");
  fraction(input.extractableDryFraction, "extractableDryFraction");
  fraction(input.solventRecoveryFraction, "solventRecoveryFraction");
  const expectedExtractSolidsGrams =
      input.dryPropolisGrams * input.extractableDryFraction,
    solvent = input.solventMassGrams * input.solventRecoveryFraction,
    expectedFiltrateMassGrams = positive(
      expectedExtractSolidsGrams + solvent,
      "filtrateMass",
    );
  return {
    expectedExtractSolidsGrams,
    expectedFiltrateMassGrams,
    filtrateSolidsMassFraction:
      expectedExtractSolidsGrams / expectedFiltrateMassGrams,
    filtrateEthanolMassFraction:
      (solvent * input.solventEthanolMassFraction) / expectedFiltrateMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryPropolisGrams: 100,
  solventMassGrams: 400,
  solventEthanolMassFraction: 0.8,
  extractableDryFraction: 0.5,
  solventRecoveryFraction: 1,
} satisfies Input;
export const exampleOutput = {
  expectedExtractSolidsGrams: 50,
  expectedFiltrateMassGrams: 450,
  filtrateSolidsMassFraction: 0.1111111111111111,
  filtrateEthanolMassFraction: 0.7111111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/propolis-tincture-ratio-alcohol-gram",
  title: "Propolis Tincture Ratio Alcohol Gram",
  description:
    "Balance caller extractable propolis solids and recovered solvent into mass-basis tincture composition; ethanol mass fraction is not ABV, and extraction effectiveness or suitability for ingestion is not established.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedExtractSolidsGrams",
      label: "Expected extract solids grams",
      kind: "number",
    },
    {
      id: "expectedFiltrateMassGrams",
      label: "Expected filtrate mass grams",
      kind: "number",
    },
    {
      id: "filtrateSolidsMassFraction",
      label: "Filtrate solids mass fraction",
      kind: "number",
    },
    {
      id: "filtrateEthanolMassFraction",
      label: "Filtrate ethanol mass fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dryPropolisGrams: value.dryPropolisGrams as number,
      solventMassGrams: value.solventMassGrams as number,
      solventEthanolMassFraction: value.solventEthanolMassFraction as number,
      extractableDryFraction: value.extractableDryFraction as number,
      solventRecoveryFraction: value.solventRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
