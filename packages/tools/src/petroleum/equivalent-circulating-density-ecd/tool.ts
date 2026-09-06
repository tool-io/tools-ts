import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAnnularLayerVerticalLengthsM: readonly number[];
  readonly observedMatchedLayerFluidDensitiesKgM3: readonly number[];
  readonly observedIndependentAnnularFrictionPa: number;
  readonly callerGravityMSecond2: number;
}>;
export type Output = Readonly<{
  readonly observedEquivalentCirculatingDensityKgM3: number;
}>;
const inputFields = [
  {
    id: "observedAnnularLayerVerticalLengthsM",
    label: "Observed annular layer vertical lengths m",
    kind: "numberList",
  },
  {
    id: "observedMatchedLayerFluidDensitiesKgM3",
    label: "Observed matched layer fluid densities kg m3",
    kind: "numberList",
  },
  {
    id: "observedIndependentAnnularFrictionPa",
    label: "Observed independent annular friction pa",
    kind: "number",
  },
  {
    id: "callerGravityMSecond2",
    label: "Caller gravity m second2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAnnularLayerVerticalLengthsM.forEach((v) =>
    positive(v, "observedAnnularLayerVerticalLengthsM"),
  );
  input.observedMatchedLayerFluidDensitiesKgM3.forEach((v) =>
    positive(v, "observedMatchedLayerFluidDensitiesKgM3"),
  );
  positive(input.callerGravityMSecond2, "callerGravityMSecond2");
  nonnegative(
    input.observedIndependentAnnularFrictionPa,
    "observedIndependentAnnularFrictionPa",
  );
  aligned(
    input.observedAnnularLayerVerticalLengthsM,
    input.observedMatchedLayerFluidDensitiesKgM3,
    "observedAnnularLayerVerticalLengthsM",
  );
  const depth = sum(input.observedAnnularLayerVerticalLengthsM),
    column = sum(
      input.observedAnnularLayerVerticalLengthsM.map(
        (v, i) => v * input.observedMatchedLayerFluidDensitiesKgM3[i],
      ),
    );
  return {
    observedEquivalentCirculatingDensityKgM3:
      column / depth +
      input.observedIndependentAnnularFrictionPa /
        input.callerGravityMSecond2 /
        depth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAnnularLayerVerticalLengthsM: [10, 20],
  observedMatchedLayerFluidDensitiesKgM3: [1000, 1100],
  observedIndependentAnnularFrictionPa: 300,
  callerGravityMSecond2: 10,
} satisfies Input;
export const exampleOutput = {
  observedEquivalentCirculatingDensityKgM3: 1067.6666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/equivalent-circulating-density-ecd",
  title: "Petroleum Equivalent Circulating Density ECD Calculator",
  description:
    "Audit actual layered annular hydrostatic inventory plus independent friction into equivalent circulating density at summed TRUE VERTICAL interval depth, no measured-depth substitution or safe mud density. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEquivalentCirculatingDensityKgM3",
      label: "Observed equivalent circulating density kg m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAnnularLayerVerticalLengthsM:
        value.observedAnnularLayerVerticalLengthsM as readonly number[],
      observedMatchedLayerFluidDensitiesKgM3:
        value.observedMatchedLayerFluidDensitiesKgM3 as readonly number[],
      observedIndependentAnnularFrictionPa:
        value.observedIndependentAnnularFrictionPa as number,
      callerGravityMSecond2: value.callerGravityMSecond2 as number,
    }),
});
export const run = tool.execute;
export default tool;
