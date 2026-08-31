import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
  aligned,
  sum,
  sumMoney,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedCellCounts: readonly number[];
  readonly observedFieldAreasMm2: readonly number[];
  readonly chamberDepthMm: number;
  readonly sampleDilutionFactor: number;
}>;
export type Output = Readonly<{
  readonly observedCountedVolumeMl: number;
  readonly estimatedOriginalCellDensityPerMl: number;
}>;
const inputFields = [
  {
    id: "observedCellCounts",
    label: "Observed cell counts",
    kind: "numberList",
  },
  {
    id: "observedFieldAreasMm2",
    label: "Observed field areas mm2",
    kind: "numberList",
  },
  { id: "chamberDepthMm", label: "Chamber depth mm", kind: "number" },
  {
    id: "sampleDilutionFactor",
    label: "Sample dilution factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFieldAreasMm2.forEach((v) =>
    positive(v, "observedFieldAreasMm2"),
  );
  positive(input.chamberDepthMm, "chamberDepthMm");
  positive(input.sampleDilutionFactor, "sampleDilutionFactor");
  input.observedCellCounts.forEach((v) => nonnegative(v, "observedCellCounts"));
  input.observedCellCounts.forEach((v) => integer(v, "observedCellCounts"));
  aligned(
    input.observedCellCounts,
    input.observedFieldAreasMm2,
    "observedCellCounts",
  );
  if (input.sampleDilutionFactor < 1)
    simpleError("dilution", "Dilution factor ≥1 required.");
  const volume =
    (sum(input.observedFieldAreasMm2) * input.chamberDepthMm) / 1000;
  return {
    observedCountedVolumeMl: volume,
    estimatedOriginalCellDensityPerMl:
      (sumMoney(input.observedCellCounts) / volume) *
      input.sampleDilutionFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCellCounts: [10, 20],
  observedFieldAreasMm2: [1, 2],
  chamberDepthMm: 1,
  sampleDilutionFactor: 2,
} satisfies Input;
export const exampleOutput = {
  observedCountedVolumeMl: 0.003,
  estimatedOriginalCellDensityPerMl: 20000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/sedgwick-rafter-cell-density",
  title: "Sedgwick Rafter Cell Density Calculator",
  description:
    "Estimate actual Sedgwick–Rafter counted-field density using measured field areas/chamber depth and dilution; no assumed full-cell volume, sampling variance or organism identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCountedVolumeMl",
      label: "Observed counted volume ml",
      kind: "number",
    },
    {
      id: "estimatedOriginalCellDensityPerMl",
      label: "Estimated original cell density per ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCellCounts: value.observedCellCounts as readonly number[],
      observedFieldAreasMm2: value.observedFieldAreasMm2 as readonly number[],
      chamberDepthMm: value.chamberDepthMm as number,
      sampleDilutionFactor: value.sampleDilutionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
