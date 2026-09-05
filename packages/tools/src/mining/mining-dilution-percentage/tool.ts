import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRecoveredWetOreTonnes: readonly number[];
  readonly observedOreDryFractions: readonly number[];
  readonly observedWetDiluentTonnes: readonly number[];
  readonly observedDiluentDryFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly observedDryDiluentFraction: number }>;
const inputFields = [
  {
    id: "observedRecoveredWetOreTonnes",
    label: "Observed recovered wet ore tonnes",
    kind: "numberList",
  },
  {
    id: "observedOreDryFractions",
    label: "Observed ore dry fractions",
    kind: "numberList",
  },
  {
    id: "observedWetDiluentTonnes",
    label: "Observed wet diluent tonnes",
    kind: "numberList",
  },
  {
    id: "observedDiluentDryFractions",
    label: "Observed diluent dry fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRecoveredWetOreTonnes.forEach((v) =>
    nonnegative(v, "observedRecoveredWetOreTonnes"),
  );
  input.observedWetDiluentTonnes.forEach((v) =>
    nonnegative(v, "observedWetDiluentTonnes"),
  );
  input.observedOreDryFractions.forEach((v) =>
    fraction(v, "observedOreDryFractions"),
  );
  input.observedDiluentDryFractions.forEach((v) =>
    fraction(v, "observedDiluentDryFractions"),
  );
  aligned(
    input.observedRecoveredWetOreTonnes,
    input.observedOreDryFractions,
    "observedRecoveredWetOreTonnes",
  );
  aligned(
    input.observedRecoveredWetOreTonnes,
    input.observedWetDiluentTonnes,
    "observedRecoveredWetOreTonnes",
  );
  aligned(
    input.observedRecoveredWetOreTonnes,
    input.observedDiluentDryFractions,
    "observedRecoveredWetOreTonnes",
  );
  const ore = sum(
      input.observedRecoveredWetOreTonnes.map(
        (v, i) => v * input.observedOreDryFractions[i],
      ),
    ),
    diluent = sum(
      input.observedWetDiluentTonnes.map(
        (v, i) => v * input.observedDiluentDryFractions[i],
      ),
    );
  positive(ore + diluent, "total dry material");
  return { observedDryDiluentFraction: diluent / (ore + diluent) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRecoveredWetOreTonnes: [10, 20],
  observedOreDryFractions: [0.8, 0.9],
  observedWetDiluentTonnes: [2, 3],
  observedDiluentDryFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  observedDryDiluentFraction: 0.13333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/mining-dilution-percentage",
  title: "Mining Dilution Percentage Calculator",
  description:
    "Extract actual moisture-corrected mining dilution inventory, dry diluent/(ore+diluent), not forward assay mixing or assumed equal moisture. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDryDiluentFraction",
      label: "Observed dry diluent fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRecoveredWetOreTonnes:
        value.observedRecoveredWetOreTonnes as readonly number[],
      observedOreDryFractions:
        value.observedOreDryFractions as readonly number[],
      observedWetDiluentTonnes:
        value.observedWetDiluentTonnes as readonly number[],
      observedDiluentDryFractions:
        value.observedDiluentDryFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
