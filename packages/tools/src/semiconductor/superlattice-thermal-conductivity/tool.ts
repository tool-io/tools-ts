import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedLayerThicknessM: readonly number[];
  readonly callerMatchedLayerConductivityWattsMK: readonly number[];
  readonly callerIndependentInterfaceResistanceM2KWatts: number;
}>;
export type Output = Readonly<{
  readonly modeledCrossPlaneSuperlatticeConductivityWattsMK: number;
}>;
const inputFields = [
  {
    id: "observedLayerThicknessM",
    label: "Observed layer thickness m",
    kind: "numberList",
  },
  {
    id: "callerMatchedLayerConductivityWattsMK",
    label: "Caller matched layer conductivity watts m k",
    kind: "numberList",
  },
  {
    id: "callerIndependentInterfaceResistanceM2KWatts",
    label: "Caller independent interface resistance m2 k watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLayerThicknessM.forEach((v) =>
    positive(v, "observedLayerThicknessM"),
  );
  input.callerMatchedLayerConductivityWattsMK.forEach((v) =>
    positive(v, "callerMatchedLayerConductivityWattsMK"),
  );
  nonnegative(
    input.callerIndependentInterfaceResistanceM2KWatts,
    "callerIndependentInterfaceResistanceM2KWatts",
  );
  aligned(
    input.observedLayerThicknessM,
    input.callerMatchedLayerConductivityWattsMK,
    "observedLayerThicknessM",
  );
  const resistance =
    sum(
      input.observedLayerThicknessM.map(
        (v, i) => v / input.callerMatchedLayerConductivityWattsMK[i],
      ),
    ) + input.callerIndependentInterfaceResistanceM2KWatts;
  return {
    modeledCrossPlaneSuperlatticeConductivityWattsMK:
      sum(input.observedLayerThicknessM) / resistance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLayerThicknessM: [1, 1],
  callerMatchedLayerConductivityWattsMK: [2, 4],
  callerIndependentInterfaceResistanceM2KWatts: 0.5,
} satisfies Input;
export const exampleOutput = {
  modeledCrossPlaneSuperlatticeConductivityWattsMK: 1.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/superlattice-thermal-conductivity",
  title: "Semiconductor Superlattice Thermal Conductivity Calculator",
  description:
    "Budget actual cross-plane superlattice series layer thermal resistance plus independent interface resistance; not arithmetic conductivity average or bulk default.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledCrossPlaneSuperlatticeConductivityWattsMK",
      label: "Modeled cross plane superlattice conductivity watts m k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLayerThicknessM:
        value.observedLayerThicknessM as readonly number[],
      callerMatchedLayerConductivityWattsMK:
        value.callerMatchedLayerConductivityWattsMK as readonly number[],
      callerIndependentInterfaceResistanceM2KWatts:
        value.callerIndependentInterfaceResistanceM2KWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
