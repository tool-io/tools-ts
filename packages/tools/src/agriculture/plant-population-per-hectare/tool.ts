import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly rowSegmentLengthsM: readonly number[];
  readonly rowSpacingsM: readonly number[];
  readonly observedPlantCounts: readonly number[];
  readonly productivePlantFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPlantDensityPerHa: number;
  readonly productiveEquivalentPlantDensityPerHa: number;
}>;
const inputFields = [
  {
    id: "rowSegmentLengthsM",
    label: "Row segment lengths m",
    kind: "numberList",
  },
  { id: "rowSpacingsM", label: "Row spacings m", kind: "numberList" },
  {
    id: "observedPlantCounts",
    label: "Observed plant counts",
    kind: "numberList",
  },
  {
    id: "productivePlantFractions",
    label: "Productive plant fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.rowSegmentLengthsM.forEach((v) => positive(v, "rowSegmentLengthsM"));
  input.rowSpacingsM.forEach((v) => positive(v, "rowSpacingsM"));
  input.productivePlantFractions.forEach((v) =>
    fraction(v, "productivePlantFractions"),
  );
  input.observedPlantCounts.forEach((v) => count(v, "observedPlantCounts"));
  aligned(input.rowSegmentLengthsM, input.rowSpacingsM, "rowSegmentLengthsM");
  aligned(
    input.rowSegmentLengthsM,
    input.observedPlantCounts,
    "rowSegmentLengthsM",
  );
  aligned(
    input.rowSegmentLengthsM,
    input.productivePlantFractions,
    "rowSegmentLengthsM",
  );
  const area = input.rowSegmentLengthsM.reduce(
    (s, l, i) => s + l * input.rowSpacingsM[i],
    0,
  );
  return {
    observedPlantDensityPerHa:
      (10000 * input.observedPlantCounts.reduce((a, b) => a + b, 0)) / area,
    productiveEquivalentPlantDensityPerHa:
      (10000 *
        input.observedPlantCounts.reduce(
          (s, v, i) => s + v * input.productivePlantFractions[i],
          0,
        )) /
      area,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rowSegmentLengthsM: [10, 20],
  rowSpacingsM: [1, 2],
  observedPlantCounts: [20, 40],
  productivePlantFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  observedPlantDensityPerHa: 12000,
  productiveEquivalentPlantDensityPerHa: 8000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/plant-population-per-hectare",
  title: "Agriculture Plant Population Per Hectare",
  description:
    "Estimate field stand/productive plant equivalents from sampled row exposure with unequal spacing and explicit productive share; does not assume all planted seed positions establish or duplicate fixed-plot tree expansion.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPlantDensityPerHa",
      label: "Observed plant density per ha",
      kind: "number",
    },
    {
      id: "productiveEquivalentPlantDensityPerHa",
      label: "Productive equivalent plant density per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rowSegmentLengthsM: value.rowSegmentLengthsM as readonly number[],
      rowSpacingsM: value.rowSpacingsM as readonly number[],
      observedPlantCounts: value.observedPlantCounts as readonly number[],
      productivePlantFractions:
        value.productivePlantFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
