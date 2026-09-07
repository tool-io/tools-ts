import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCompositionFractions: readonly number[];
  readonly observedFreeEnergy: readonly number[];
}>;
export type Output = Readonly<{
  readonly discreteFreeEnergySecondDerivatives: readonly number[];
  readonly negativeCurvatureInteriorCompositionFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCompositionFractions",
    label: "Observed composition fractions",
    kind: "numberList",
  },
  {
    id: "observedFreeEnergy",
    label: "Observed free energy",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCompositionFractions.forEach((v) =>
    fraction(v, "observedCompositionFractions"),
  );
  aligned(
    input.observedCompositionFractions,
    input.observedFreeEnergy,
    "freeEnergy",
  );
  strictlyIncreasing(input.observedCompositionFractions, "composition", 3);
  const second = input.observedCompositionFractions.slice(1, -1).map((x, i) => {
    const a = input.observedCompositionFractions[i],
      b = input.observedCompositionFractions[i + 2];
    return (
      (2 *
        ((input.observedFreeEnergy[i + 2] - input.observedFreeEnergy[i + 1]) /
          (b - x) -
          (input.observedFreeEnergy[i + 1] - input.observedFreeEnergy[i]) /
            (x - a))) /
      (b - a)
    );
  });
  return {
    discreteFreeEnergySecondDerivatives: second,
    negativeCurvatureInteriorCompositionFractions: second.flatMap((v, i) =>
      v < 0 ? [input.observedCompositionFractions[i + 1]] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCompositionFractions: [0, 0.25, 0.5, 0.75, 1],
  observedFreeEnergy: [1, 0.5, 0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  discreteFreeEnergySecondDerivatives: [0, 16, 0],
  negativeCurvatureInteriorCompositionFractions: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/phase-separation-spinodal",
  title: "Semiconductor Phase Separation Spinodal Calculator",
  description:
    "Audit local unequal-grid discrete free-energy curvature/spinodal candidates, not global common-tangent coexistence or inferred stability outside sampled composition.",
  inputs: inputFields,
  outputs: [
    {
      id: "discreteFreeEnergySecondDerivatives",
      label: "Discrete free energy second derivatives",
      kind: "numberList",
    },
    {
      id: "negativeCurvatureInteriorCompositionFractions",
      label: "Negative curvature interior composition fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCompositionFractions:
        value.observedCompositionFractions as readonly number[],
      observedFreeEnergy: value.observedFreeEnergy as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
