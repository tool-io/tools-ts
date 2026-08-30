import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetFinalNitrogenMgPerLiter: number;
  readonly sourceWaterNitrogenMgPerLiter: number;
  readonly stockVolumeLiters: number;
  readonly stockFractionOfFinalFlow: number;
  readonly fertilizerNitrogenMassFraction: number;
  readonly fertilizerAssayPurityFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredStockNitrogenMgPerLiter: number;
  readonly requiredFertilizerGrams: number;
}>;
const inputFields = [
  {
    id: "targetFinalNitrogenMgPerLiter",
    label: "Target final nitrogen mg per liter",
    kind: "number",
  },
  {
    id: "sourceWaterNitrogenMgPerLiter",
    label: "Source water nitrogen mg per liter",
    kind: "number",
  },
  { id: "stockVolumeLiters", label: "Stock volume liters", kind: "number" },
  {
    id: "stockFractionOfFinalFlow",
    label: "Stock fraction of final flow",
    kind: "number",
  },
  {
    id: "fertilizerNitrogenMassFraction",
    label: "Fertilizer nitrogen mass fraction",
    kind: "number",
  },
  {
    id: "fertilizerAssayPurityFraction",
    label: "Fertilizer assay purity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stockVolumeLiters, "stockVolumeLiters");
  positive(input.stockFractionOfFinalFlow, "stockFractionOfFinalFlow");
  positive(
    input.fertilizerNitrogenMassFraction,
    "fertilizerNitrogenMassFraction",
  );
  positive(
    input.fertilizerAssayPurityFraction,
    "fertilizerAssayPurityFraction",
  );
  nonnegative(
    input.targetFinalNitrogenMgPerLiter,
    "targetFinalNitrogenMgPerLiter",
  );
  nonnegative(
    input.sourceWaterNitrogenMgPerLiter,
    "sourceWaterNitrogenMgPerLiter",
  );
  fraction(input.stockFractionOfFinalFlow, "stockFractionOfFinalFlow");
  fraction(
    input.fertilizerNitrogenMassFraction,
    "fertilizerNitrogenMassFraction",
  );
  fraction(
    input.fertilizerAssayPurityFraction,
    "fertilizerAssayPurityFraction",
  );
  if (input.targetFinalNitrogenMgPerLiter < input.sourceWaterNitrogenMgPerLiter)
    simpleError(
      "targetFinalNitrogenMgPerLiter",
      "Below-source targets require nutrient removal not this stock-addition model.",
    );
  const requiredStockNitrogenMgPerLiter =
    input.sourceWaterNitrogenMgPerLiter +
    (input.targetFinalNitrogenMgPerLiter -
      input.sourceWaterNitrogenMgPerLiter) /
      input.stockFractionOfFinalFlow;
  return {
    requiredStockNitrogenMgPerLiter,
    requiredFertilizerGrams:
      (requiredStockNitrogenMgPerLiter * input.stockVolumeLiters) /
      1000 /
      (input.fertilizerNitrogenMassFraction *
        input.fertilizerAssayPurityFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetFinalNitrogenMgPerLiter: 100,
  sourceWaterNitrogenMgPerLiter: 10,
  stockVolumeLiters: 20,
  stockFractionOfFinalFlow: 0.01,
  fertilizerNitrogenMassFraction: 0.2,
  fertilizerAssayPurityFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  requiredStockNitrogenMgPerLiter: 9010,
  requiredFertilizerGrams: 1001.1111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/stock-solution-nitrogen-ppm-target",
  title: "Stock Solution Nitrogen PPM Target",
  description:
    "Invert exact final-flow stock replacement and source-water nitrogen to fertilizer stock mass, assuming stock is made in nitrogen-free water; not DAP nitrogen contribution, solubility validation or a crop dosing recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredStockNitrogenMgPerLiter",
      label: "Required stock nitrogen mg per liter",
      kind: "number",
    },
    {
      id: "requiredFertilizerGrams",
      label: "Required fertilizer grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetFinalNitrogenMgPerLiter:
        value.targetFinalNitrogenMgPerLiter as number,
      sourceWaterNitrogenMgPerLiter:
        value.sourceWaterNitrogenMgPerLiter as number,
      stockVolumeLiters: value.stockVolumeLiters as number,
      stockFractionOfFinalFlow: value.stockFractionOfFinalFlow as number,
      fertilizerNitrogenMassFraction:
        value.fertilizerNitrogenMassFraction as number,
      fertilizerAssayPurityFraction:
        value.fertilizerAssayPurityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
