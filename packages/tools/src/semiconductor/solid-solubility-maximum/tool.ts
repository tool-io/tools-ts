import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  extrema,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSolvusKelvin: readonly number[];
  readonly observedSolidSolubilityFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMaximumSolidSolubilityFraction: number;
  readonly temperaturesAtObservedMaximumKelvin: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSolvusKelvin",
    label: "Observed solvus kelvin",
    kind: "numberList",
  },
  {
    id: "observedSolidSolubilityFractions",
    label: "Observed solid solubility fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSolvusKelvin.forEach((v) =>
    positive(v, "observedSolvusKelvin"),
  );
  input.observedSolidSolubilityFractions.forEach((v) =>
    fraction(v, "observedSolidSolubilityFractions"),
  );
  const result = extrema(
    input.observedSolvusKelvin,
    input.observedSolidSolubilityFractions,
    true,
  );
  return {
    observedMaximumSolidSolubilityFraction: result.value,
    temperaturesAtObservedMaximumKelvin: result.coordinates,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSolvusKelvin: [100, 200, 300],
  observedSolidSolubilityFractions: [0.1, 0.3, 0.2],
} satisfies Input;
export const exampleOutput = {
  observedMaximumSolidSolubilityFraction: 0.3,
  temperaturesAtObservedMaximumKelvin: [200],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/solid-solubility-maximum",
  title: "Semiconductor Solid Solubility Maximum Calculator",
  description:
    "Locate measured solvus solid-solubility maximum and tied temperatures, distinct from interpolated dilute dopant concentration at caller temperature; no extrapolated physical maximum.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMaximumSolidSolubilityFraction",
      label: "Observed maximum solid solubility fraction",
      kind: "number",
    },
    {
      id: "temperaturesAtObservedMaximumKelvin",
      label: "Temperatures at observed maximum kelvin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSolvusKelvin: value.observedSolvusKelvin as readonly number[],
      observedSolidSolubilityFractions:
        value.observedSolidSolubilityFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
