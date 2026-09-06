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
  readonly observedOilPatchAreasM2: readonly number[];
  readonly observedOilNetThicknessM: readonly number[];
  readonly observedOilPorosityFractions: readonly number[];
  readonly observedOilWaterSaturationFractions: readonly number[];
  readonly callerMatchedOilFormationVolumeFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerVolumetricOriginalStockM3: number;
}>;
const inputFields = [
  {
    id: "observedOilPatchAreasM2",
    label: "Observed oil patch areas m2",
    kind: "numberList",
  },
  {
    id: "observedOilNetThicknessM",
    label: "Observed oil net thickness m",
    kind: "numberList",
  },
  {
    id: "observedOilPorosityFractions",
    label: "Observed oil porosity fractions",
    kind: "numberList",
  },
  {
    id: "observedOilWaterSaturationFractions",
    label: "Observed oil water saturation fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedOilFormationVolumeFactors",
    label: "Caller matched oil formation volume factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOilPatchAreasM2.forEach((v) =>
    positive(v, "observedOilPatchAreasM2"),
  );
  input.observedOilNetThicknessM.forEach((v) =>
    positive(v, "observedOilNetThicknessM"),
  );
  input.callerMatchedOilFormationVolumeFactors.forEach((v) =>
    positive(v, "callerMatchedOilFormationVolumeFactors"),
  );
  input.observedOilPorosityFractions.forEach((v) =>
    fraction(v, "observedOilPorosityFractions"),
  );
  input.observedOilWaterSaturationFractions.forEach((v) =>
    fraction(v, "observedOilWaterSaturationFractions"),
  );
  aligned(
    input.observedOilPatchAreasM2,
    input.observedOilNetThicknessM,
    "observedOilPatchAreasM2",
  );
  aligned(
    input.observedOilPatchAreasM2,
    input.observedOilPorosityFractions,
    "observedOilPatchAreasM2",
  );
  aligned(
    input.observedOilPatchAreasM2,
    input.observedOilWaterSaturationFractions,
    "observedOilPatchAreasM2",
  );
  aligned(
    input.observedOilPatchAreasM2,
    input.callerMatchedOilFormationVolumeFactors,
    "observedOilPatchAreasM2",
  );
  return {
    callerVolumetricOriginalStockM3: sum(
      input.observedOilPatchAreasM2.map(
        (v, i) =>
          (v *
            input.observedOilNetThicknessM[i] *
            input.observedOilPorosityFractions[i] *
            (1 - input.observedOilWaterSaturationFractions[i])) /
          input.callerMatchedOilFormationVolumeFactors[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOilPatchAreasM2: [1, 2],
  observedOilNetThicknessM: [2, 3],
  observedOilPorosityFractions: [0.5, 0.5],
  observedOilWaterSaturationFractions: [0.2, 0.4],
  callerMatchedOilFormationVolumeFactors: [2, 3],
} satisfies Input;
export const exampleOutput = {
  callerVolumetricOriginalStockM3: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/original-oil-in-place-ooip",
  title: "Petroleum Original Oil In Place OOIP Calculator",
  description:
    "Inventory independently verified nonoverlapping oil reservoir patches A h φ(1−Sw)/B into stock volume, all m²/m/m³ conventions explicit; no reserves, geology continuity or single homogeneous patch assumption. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedOilPatchAreasM2:
        value.observedOilPatchAreasM2 as readonly number[],
      observedOilNetThicknessM:
        value.observedOilNetThicknessM as readonly number[],
      observedOilPorosityFractions:
        value.observedOilPorosityFractions as readonly number[],
      observedOilWaterSaturationFractions:
        value.observedOilWaterSaturationFractions as readonly number[],
      callerMatchedOilFormationVolumeFactors:
        value.callerMatchedOilFormationVolumeFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
