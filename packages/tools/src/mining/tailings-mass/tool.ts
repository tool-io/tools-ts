import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDryFeedTonnes: readonly number[];
  readonly observedDryConcentrateTonnes: readonly number[];
  readonly observedIndependentDryRecycleTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNetExternalTailingsTonnes: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDryFeedTonnes",
    label: "Observed dry feed tonnes",
    kind: "numberList",
  },
  {
    id: "observedDryConcentrateTonnes",
    label: "Observed dry concentrate tonnes",
    kind: "numberList",
  },
  {
    id: "observedIndependentDryRecycleTonnes",
    label: "Observed independent dry recycle tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDryFeedTonnes.forEach((v) =>
    nonnegative(v, "observedDryFeedTonnes"),
  );
  input.observedDryConcentrateTonnes.forEach((v) =>
    nonnegative(v, "observedDryConcentrateTonnes"),
  );
  input.observedIndependentDryRecycleTonnes.forEach((v) =>
    nonnegative(v, "observedIndependentDryRecycleTonnes"),
  );
  aligned(
    input.observedDryFeedTonnes,
    input.observedDryConcentrateTonnes,
    "observedDryFeedTonnes",
  );
  aligned(
    input.observedDryFeedTonnes,
    input.observedIndependentDryRecycleTonnes,
    "observedDryFeedTonnes",
  );
  return {
    observedNetExternalTailingsTonnes: input.observedDryFeedTonnes.map(
      (v, i) => {
        const tail =
          v -
          input.observedDryConcentrateTonnes[i] -
          input.observedIndependentDryRecycleTonnes[i];
        nonnegative(tail, "external tails");
        return tail;
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDryFeedTonnes: [10, 20],
  observedDryConcentrateTonnes: [2, 3],
  observedIndependentDryRecycleTonnes: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedNetExternalTailingsTonnes: [7, 15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/tailings-mass",
  title: "Tailings Mass Calculator",
  description:
    "Reconcile dry solids to external tailings after separately observed concentrate and exported/recycle stream boundary, not two-product assay tailings-grade inversion; internal recirculation already caller resolved. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNetExternalTailingsTonnes",
      label: "Observed net external tailings tonnes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDryFeedTonnes: value.observedDryFeedTonnes as readonly number[],
      observedDryConcentrateTonnes:
        value.observedDryConcentrateTonnes as readonly number[],
      observedIndependentDryRecycleTonnes:
        value.observedIndependentDryRecycleTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
