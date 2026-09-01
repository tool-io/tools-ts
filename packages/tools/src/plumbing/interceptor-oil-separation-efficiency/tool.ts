import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedOilInletMgLiter: readonly number[];
  readonly observedOilOutletMgLiter: readonly number[];
  readonly matchedWaterVolumesLiters: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedOilRemovalFractions: readonly number[];
  readonly volumeWeightedOilMassRemovalFraction: number;
}>;
const inputFields = [
  {
    id: "observedOilInletMgLiter",
    label: "Observed oil inlet mg liter",
    kind: "numberList",
  },
  {
    id: "observedOilOutletMgLiter",
    label: "Observed oil outlet mg liter",
    kind: "numberList",
  },
  {
    id: "matchedWaterVolumesLiters",
    label: "Matched water volumes liters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOilInletMgLiter.forEach((v) =>
    positive(v, "observedOilInletMgLiter"),
  );
  input.matchedWaterVolumesLiters.forEach((v) =>
    positive(v, "matchedWaterVolumesLiters"),
  );
  input.observedOilOutletMgLiter.forEach((v) =>
    nonnegative(v, "observedOilOutletMgLiter"),
  );
  aligned(
    input.observedOilInletMgLiter,
    input.observedOilOutletMgLiter,
    "observedOilInletMgLiter",
  );
  aligned(
    input.observedOilInletMgLiter,
    input.matchedWaterVolumesLiters,
    "observedOilInletMgLiter",
  );
  const massIn = sum(
      input.observedOilInletMgLiter.map(
        (v, i) => v * input.matchedWaterVolumesLiters[i],
      ),
    ),
    massOut = sum(
      input.observedOilOutletMgLiter.map(
        (v, i) => v * input.matchedWaterVolumesLiters[i],
      ),
    );
  return {
    observedOilRemovalFractions: input.observedOilInletMgLiter.map(
      (v, i) => (v - input.observedOilOutletMgLiter[i]) / v,
    ),
    volumeWeightedOilMassRemovalFraction: (massIn - massOut) / massIn,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOilInletMgLiter: [100, 200],
  observedOilOutletMgLiter: [20, 100],
  matchedWaterVolumesLiters: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedOilRemovalFractions: [0.8, 0.5],
  volumeWeightedOilMassRemovalFraction: 0.56,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/interceptor-oil-separation-efficiency",
  title: "Plumbing Interceptor Oil Separation Efficiency Calculator",
  description:
    "Reconcile actual paired oil/water separator concentrations by independently matched water volumes, not mean percentages or BOD-only alias; signed mass increases retained, no discharge-quality approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOilRemovalFractions",
      label: "Observed oil removal fractions",
      kind: "numberList",
    },
    {
      id: "volumeWeightedOilMassRemovalFraction",
      label: "Volume weighted oil mass removal fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOilInletMgLiter:
        value.observedOilInletMgLiter as readonly number[],
      observedOilOutletMgLiter:
        value.observedOilOutletMgLiter as readonly number[],
      matchedWaterVolumesLiters:
        value.matchedWaterVolumesLiters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
