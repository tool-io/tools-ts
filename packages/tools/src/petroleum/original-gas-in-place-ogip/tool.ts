import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGasPatchAreasM2: readonly number[];
  readonly observedGasNetThicknessM: readonly number[];
  readonly observedGasPorosityFractions: readonly number[];
  readonly observedGasWaterSaturationFractions: readonly number[];
  readonly callerMatchedGasFormationVolumeFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerVolumetricOriginalStockM3: number;
}>;
const inputFields = [
  {
    id: "observedGasPatchAreasM2",
    label: "Observed gas patch areas m2",
    kind: "numberList",
  },
  {
    id: "observedGasNetThicknessM",
    label: "Observed gas net thickness m",
    kind: "numberList",
  },
  {
    id: "observedGasPorosityFractions",
    label: "Observed gas porosity fractions",
    kind: "numberList",
  },
  {
    id: "observedGasWaterSaturationFractions",
    label: "Observed gas water saturation fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedGasFormationVolumeFactors",
    label: "Caller matched gas formation volume factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGasPatchAreasM2.forEach((v) =>
    positive(v, "observedGasPatchAreasM2"),
  );
  input.observedGasNetThicknessM.forEach((v) =>
    positive(v, "observedGasNetThicknessM"),
  );
  input.callerMatchedGasFormationVolumeFactors.forEach((v) =>
    positive(v, "callerMatchedGasFormationVolumeFactors"),
  );
  input.observedGasPorosityFractions.forEach((v) =>
    fraction(v, "observedGasPorosityFractions"),
  );
  input.observedGasWaterSaturationFractions.forEach((v) =>
    fraction(v, "observedGasWaterSaturationFractions"),
  );
  aligned(
    input.observedGasPatchAreasM2,
    input.observedGasNetThicknessM,
    "observedGasPatchAreasM2",
  );
  aligned(
    input.observedGasPatchAreasM2,
    input.observedGasPorosityFractions,
    "observedGasPatchAreasM2",
  );
  aligned(
    input.observedGasPatchAreasM2,
    input.observedGasWaterSaturationFractions,
    "observedGasPatchAreasM2",
  );
  aligned(
    input.observedGasPatchAreasM2,
    input.callerMatchedGasFormationVolumeFactors,
    "observedGasPatchAreasM2",
  );
  return {
    callerVolumetricOriginalStockM3: sum(
      input.observedGasPatchAreasM2.map(
        (v, i) =>
          (v *
            input.observedGasNetThicknessM[i] *
            input.observedGasPorosityFractions[i] *
            (1 - input.observedGasWaterSaturationFractions[i])) /
          input.callerMatchedGasFormationVolumeFactors[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGasPatchAreasM2: [1, 2],
  observedGasNetThicknessM: [2, 3],
  observedGasPorosityFractions: [0.5, 0.5],
  observedGasWaterSaturationFractions: [0.2, 0.4],
  callerMatchedGasFormationVolumeFactors: [2, 3],
} satisfies Input;
export const exampleOutput = {
  callerVolumetricOriginalStockM3: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/original-gas-in-place-ogip",
  title: "Petroleum Original Gas In Place OGIP Calculator",
  description:
    "Inventory independently verified nonoverlapping gas reservoir patches A h φ(1−Sw)/B into stock volume, all m²/m/m³ conventions explicit; no reserves, geology continuity or single homogeneous patch assumption. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerVolumetricOriginalStockM3",
      label: "Caller volumetric original stock m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGasPatchAreasM2:
        value.observedGasPatchAreasM2 as readonly number[],
      observedGasNetThicknessM:
        value.observedGasNetThicknessM as readonly number[],
      observedGasPorosityFractions:
        value.observedGasPorosityFractions as readonly number[],
      observedGasWaterSaturationFractions:
        value.observedGasWaterSaturationFractions as readonly number[],
      callerMatchedGasFormationVolumeFactors:
        value.callerMatchedGasFormationVolumeFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
