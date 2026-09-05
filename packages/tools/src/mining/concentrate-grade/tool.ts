import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
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
  readonly observedConcentrateWetTonnes: readonly number[];
  readonly observedConcentrateDryFractions: readonly number[];
  readonly observedContainedMetalTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMoistureCorrectedConcentrateGradeFraction: number;
}>;
const inputFields = [
  {
    id: "observedConcentrateWetTonnes",
    label: "Observed concentrate wet tonnes",
    kind: "numberList",
  },
  {
    id: "observedConcentrateDryFractions",
    label: "Observed concentrate dry fractions",
    kind: "numberList",
  },
  {
    id: "observedContainedMetalTonnes",
    label: "Observed contained metal tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedConcentrateWetTonnes.forEach((v) =>
    nonnegative(v, "observedConcentrateWetTonnes"),
  );
  input.observedContainedMetalTonnes.forEach((v) =>
    nonnegative(v, "observedContainedMetalTonnes"),
  );
  input.observedConcentrateDryFractions.forEach((v) =>
    fraction(v, "observedConcentrateDryFractions"),
  );
  aligned(
    input.observedConcentrateWetTonnes,
    input.observedConcentrateDryFractions,
    "observedConcentrateWetTonnes",
  );
  aligned(
    input.observedConcentrateWetTonnes,
    input.observedContainedMetalTonnes,
    "observedConcentrateWetTonnes",
  );
  const dry = input.observedConcentrateWetTonnes.map(
    (v, i) => v * input.observedConcentrateDryFractions[i],
  );
  dry.forEach((v, i) => {
    if (input.observedContainedMetalTonnes[i] > v)
      simpleError("metal", "Measured contained metal≤dry concentrate mass.");
  });
  positive(sum(dry), "dry mass");
  return {
    observedMoistureCorrectedConcentrateGradeFraction:
      sum(input.observedContainedMetalTonnes) / sum(dry),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConcentrateWetTonnes: [2, 3],
  observedConcentrateDryFractions: [0.5, 1],
  observedContainedMetalTonnes: [0.2, 0.6],
} satisfies Input;
export const exampleOutput = {
  observedMoistureCorrectedConcentrateGradeFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/concentrate-grade",
  title: "Concentrate Grade Calculator",
  description:
    "Infer actual concentrate grade from independent wet/dry and contained-metal observations, not feed/tailings inferred grade or product recovery. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMoistureCorrectedConcentrateGradeFraction",
      label: "Observed moisture corrected concentrate grade fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConcentrateWetTonnes:
        value.observedConcentrateWetTonnes as readonly number[],
      observedConcentrateDryFractions:
        value.observedConcentrateDryFractions as readonly number[],
      observedContainedMetalTonnes:
        value.observedContainedMetalTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
