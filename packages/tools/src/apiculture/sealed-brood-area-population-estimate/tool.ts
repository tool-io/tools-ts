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
  readonly sealedAreasCm2: readonly number[];
  readonly cellsPerCm2: readonly number[];
  readonly viableEmergenceFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly estimatedSealedCells: number;
  readonly expectedEmergingWorkers: number;
}>;
const inputFields = [
  { id: "sealedAreasCm2", label: "Sealed areas cm2", kind: "numberList" },
  { id: "cellsPerCm2", label: "Cells per cm2", kind: "numberList" },
  {
    id: "viableEmergenceFractions",
    label: "Viable emergence fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cellsPerCm2.forEach((v) => positive(v, "cellsPerCm2"));
  input.sealedAreasCm2.forEach((v) => nonnegative(v, "sealedAreasCm2"));
  input.viableEmergenceFractions.forEach((v) =>
    fraction(v, "viableEmergenceFractions"),
  );
  aligned(input.sealedAreasCm2, input.cellsPerCm2, "sealedAreasCm2");
  aligned(
    input.sealedAreasCm2,
    input.viableEmergenceFractions,
    "sealedAreasCm2",
  );
  const cells = input.sealedAreasCm2.map((a, i) => a * input.cellsPerCm2[i]);
  return {
    estimatedSealedCells: cells.reduce((a, b) => a + b, 0),
    expectedEmergingWorkers: cells.reduce(
      (s, v, i) => s + v * input.viableEmergenceFractions[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sealedAreasCm2: [100, 200],
  cellsPerCm2: [4, 4],
  viableEmergenceFractions: [0.9, 0.8],
} satisfies Input;
export const exampleOutput = {
  estimatedSealedCells: 1200,
  expectedEmergingWorkers: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/sealed-brood-area-population-estimate",
  title: "Sealed Brood Area Population Estimate",
  description:
    "Estimate sealed cells and expected viable emergence from disjoint measured brood areas and caller cell-density/viability calibration; not a fixed frame population lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedSealedCells",
      label: "Estimated sealed cells",
      kind: "number",
    },
    {
      id: "expectedEmergingWorkers",
      label: "Expected emerging workers",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sealedAreasCm2: value.sealedAreasCm2 as readonly number[],
      cellsPerCm2: value.cellsPerCm2 as readonly number[],
      viableEmergenceFractions:
        value.viableEmergenceFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
