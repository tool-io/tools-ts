import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly layerThicknessMm: readonly number[];
  readonly fieldCapacityFractions: readonly number[];
  readonly wiltingFractions: readonly number[];
  readonly rootedFractions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "layerThicknessMm", label: "Layer thickness mm", kind: "numberList" },
  {
    id: "fieldCapacityFractions",
    label: "Field capacity fractions",
    kind: "numberList",
  },
  { id: "wiltingFractions", label: "Wilting fractions", kind: "numberList" },
  { id: "rootedFractions", label: "Rooted fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.layerThicknessMm, i.fieldCapacityFractions, "layers");
  aligned(i.layerThicknessMm, i.wiltingFractions, "layers");
  aligned(i.layerThicknessMm, i.rootedFractions, "layers");
  i.layerThicknessMm.forEach((v) => positive(v, "thickness"));
  i.fieldCapacityFractions.forEach((v, j) => {
    fraction(v, "fc");
    fraction(i.wiltingFractions[j], "pwp");
    fraction(i.rootedFractions[j], "root");
    if (v < i.wiltingFractions[j])
      simpleError("fc", "FC must not be below PWP.");
  });
  const layers = i.layerThicknessMm.map(
    (v, j) =>
      v *
      (i.fieldCapacityFractions[j] - i.wiltingFractions[j]) *
      i.rootedFractions[j],
  );
  return {
    availableWaterMmByLayer: layers,
    totalAvailableWaterMm: sum(layers),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    layerThicknessMm: [100, 200],
    fieldCapacityFractions: [0.3, 0.4],
    wiltingFractions: [0.1, 0.2],
    rootedFractions: [1, 0.5],
  },
  output: {
    result: { availableWaterMmByLayer: [20, 20], totalAvailableWaterMm: 40 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/soil-profile-available-water-vine-rooting",
  title: "Soil Profile Available Water Vine Rooting Calculator",
  description:
    "Integrate measured volumetric available-water differences through independently established rooted layer fractions. No crop-water stress prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
