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
  readonly layerThicknessesM: readonly number[];
  readonly fieldCapacityVolumetricFractions: readonly number[];
  readonly wiltingPointVolumetricFractions: readonly number[];
  readonly accessibleRootFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerAccessibleAvailableWaterMm: readonly number[];
  readonly rootAccessibleAvailableWaterMm: number;
}>;
const inputFields = [
  { id: "layerThicknessesM", label: "Layer thicknesses m", kind: "numberList" },
  {
    id: "fieldCapacityVolumetricFractions",
    label: "Field capacity volumetric fractions",
    kind: "numberList",
  },
  {
    id: "wiltingPointVolumetricFractions",
    label: "Wilting point volumetric fractions",
    kind: "numberList",
  },
  {
    id: "accessibleRootFractions",
    label: "Accessible root fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerThicknessesM.forEach((v) => positive(v, "layerThicknessesM"));
  input.fieldCapacityVolumetricFractions.forEach((v) =>
    fraction(v, "fieldCapacityVolumetricFractions"),
  );
  input.wiltingPointVolumetricFractions.forEach((v) =>
    fraction(v, "wiltingPointVolumetricFractions"),
  );
  input.accessibleRootFractions.forEach((v) =>
    fraction(v, "accessibleRootFractions"),
  );
  aligned(
    input.layerThicknessesM,
    input.fieldCapacityVolumetricFractions,
    "layerThicknessesM",
  );
  aligned(
    input.layerThicknessesM,
    input.wiltingPointVolumetricFractions,
    "layerThicknessesM",
  );
  aligned(
    input.layerThicknessesM,
    input.accessibleRootFractions,
    "layerThicknessesM",
  );
  const layerAccessibleAvailableWaterMm = input.layerThicknessesM.map(
    (h, i) =>
      1000 *
      h *
      nonnegative(
        input.fieldCapacityVolumetricFractions[i] -
          input.wiltingPointVolumetricFractions[i],
        "fieldCapacity",
      ) *
      input.accessibleRootFractions[i],
  );
  return {
    layerAccessibleAvailableWaterMm,
    rootAccessibleAvailableWaterMm: layerAccessibleAvailableWaterMm.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerThicknessesM: [0.1, 0.2],
  fieldCapacityVolumetricFractions: [0.3, 0.4],
  wiltingPointVolumetricFractions: [0.1, 0.2],
  accessibleRootFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  layerAccessibleAvailableWaterMm: [20, 20],
  rootAccessibleAvailableWaterMm: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-water-holding-capacity",
  title: "Agriculture Soil Water Holding Capacity",
  description:
    "Integrate measured layer field-capacity minus wilting-point water with explicit root accessibility; differs from soil porosity or gross field-capacity storage and no crop rooting depth is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerAccessibleAvailableWaterMm",
      label: "Layer accessible available water mm",
      kind: "numberList",
    },
    {
      id: "rootAccessibleAvailableWaterMm",
      label: "Root accessible available water mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerThicknessesM: value.layerThicknessesM as readonly number[],
      fieldCapacityVolumetricFractions:
        value.fieldCapacityVolumetricFractions as readonly number[],
      wiltingPointVolumetricFractions:
        value.wiltingPointVolumetricFractions as readonly number[],
      accessibleRootFractions:
        value.accessibleRootFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
