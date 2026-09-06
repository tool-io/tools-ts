import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedStopeWetTonnages: readonly number[];
  readonly observedStopeDryFractions: readonly number[];
  readonly observedIndependentDeliveredDryTonnes: number;
}>;
export type Output = Readonly<{
  readonly observedStopeDryTonnes: number;
  readonly signedDeliveredMinusStopeDryTonnes: number;
}>;
const inputFields = [
  {
    id: "observedStopeWetTonnages",
    label: "Observed stope wet tonnages",
    kind: "numberList",
  },
  {
    id: "observedStopeDryFractions",
    label: "Observed stope dry fractions",
    kind: "numberList",
  },
  {
    id: "observedIndependentDeliveredDryTonnes",
    label: "Observed independent delivered dry tonnes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStopeWetTonnages.forEach((v) =>
    nonnegative(v, "observedStopeWetTonnages"),
  );
  nonnegative(
    input.observedIndependentDeliveredDryTonnes,
    "observedIndependentDeliveredDryTonnes",
  );
  input.observedStopeDryFractions.forEach((v) =>
    fraction(v, "observedStopeDryFractions"),
  );
  aligned(
    input.observedStopeWetTonnages,
    input.observedStopeDryFractions,
    "observedStopeWetTonnages",
  );
  const tonnes = sum(
    input.observedStopeWetTonnages.map(
      (v, i) => v * input.observedStopeDryFractions[i],
    ),
  );
  return {
    observedStopeDryTonnes: tonnes,
    signedDeliveredMinusStopeDryTonnes:
      input.observedIndependentDeliveredDryTonnes - tonnes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStopeWetTonnages: [10, 20],
  observedStopeDryFractions: [0.8, 0.9],
  observedIndependentDeliveredDryTonnes: 25,
} satisfies Input;
export const exampleOutput = {
  observedStopeDryTonnes: 26,
  signedDeliveredMinusStopeDryTonnes: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stope-tonnage",
  title: "Stope Tonnage Calculator",
  description:
    "Reconcile actual moisture-corrected stope extraction weights versus independent delivered dry ledger, not volume×density predicted ore tonnage. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStopeDryTonnes",
      label: "Observed stope dry tonnes",
      kind: "number",
    },
    {
      id: "signedDeliveredMinusStopeDryTonnes",
      label: "Signed delivered minus stope dry tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStopeWetTonnages:
        value.observedStopeWetTonnages as readonly number[],
      observedStopeDryFractions:
        value.observedStopeDryFractions as readonly number[],
      observedIndependentDeliveredDryTonnes:
        value.observedIndependentDeliveredDryTonnes as number,
    }),
});
export const run = tool.execute;
export default tool;
