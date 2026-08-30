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
  readonly predatorWetConcentrations: readonly number[];
  readonly preyWetConcentrations: readonly number[];
  readonly predatorLipidFractions: readonly number[];
  readonly preyLipidFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly wetWeightRatios: readonly number[];
  readonly lipidNormalizedRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "predatorWetConcentrations",
    label: "Predator wet concentrations",
    kind: "numberList",
  },
  {
    id: "preyWetConcentrations",
    label: "Prey wet concentrations",
    kind: "numberList",
  },
  {
    id: "predatorLipidFractions",
    label: "Predator lipid fractions",
    kind: "numberList",
  },
  {
    id: "preyLipidFractions",
    label: "Prey lipid fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.predatorWetConcentrations,
    input.preyWetConcentrations,
    "predatorWetConcentrations",
  );
  aligned(
    input.predatorWetConcentrations,
    input.predatorLipidFractions,
    "predatorWetConcentrations",
  );
  aligned(
    input.predatorWetConcentrations,
    input.preyLipidFractions,
    "predatorWetConcentrations",
  );
  input.predatorWetConcentrations.forEach((v) =>
    nonnegative(v, "predatorWetConcentrations"),
  );
  input.preyWetConcentrations.forEach((v) =>
    positive(v, "preyWetConcentrations"),
  );
  [input.predatorLipidFractions, input.preyLipidFractions].forEach((row) =>
    row.forEach((v) => {
      positive(v, "lipidFractions");
      fraction(v, "lipidFractions");
    }),
  );
  const wetWeightRatios = input.predatorWetConcentrations.map(
    (v, i) => v / input.preyWetConcentrations[i],
  );
  return {
    wetWeightRatios,
    lipidNormalizedRatios: wetWeightRatios.map(
      (v, i) =>
        (v * input.preyLipidFractions[i]) / input.predatorLipidFractions[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  predatorWetConcentrations: [2, 4],
  preyWetConcentrations: [1, 2],
  predatorLipidFractions: [0.2, 0.2],
  preyLipidFractions: [0.1, 0.1],
} satisfies Input;
export const exampleOutput = {
  wetWeightRatios: [2, 2],
  lipidNormalizedRatios: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/lipid-normalized-biomagnification",
  title: "Biomagnification Factor",
  description:
    "Compare paired predator/prey wet-weight and lipid-normalized concentration ratios; feeding ecology and steady state are not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "wetWeightRatios", label: "Wet weight ratios", kind: "numberList" },
    {
      id: "lipidNormalizedRatios",
      label: "Lipid normalized ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      predatorWetConcentrations:
        value.predatorWetConcentrations as readonly number[],
      preyWetConcentrations: value.preyWetConcentrations as readonly number[],
      predatorLipidFractions: value.predatorLipidFractions as readonly number[],
      preyLipidFractions: value.preyLipidFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
