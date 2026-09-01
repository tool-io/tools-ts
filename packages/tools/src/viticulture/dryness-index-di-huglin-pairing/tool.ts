import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  points,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerPairedClimateClassIds: readonly string[];
  readonly callerDrynessIndexBandsMm: readonly (readonly number[])[];
  readonly callerHuglinIndexBands: readonly (readonly number[])[];
  readonly independentlyEstablishedDrynessIndexMm: number;
  readonly independentlyEstablishedHuglinIndex: number;
}>;
export type Output = Readonly<{
  readonly callerCompatiblePairedClimateClassIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPairedClimateClassIds",
    label: "Caller paired climate class ids",
    kind: "stringList",
  },
  {
    id: "callerDrynessIndexBandsMm",
    label: "Caller dryness index bands mm",
    kind: "matrix",
  },
  {
    id: "callerHuglinIndexBands",
    label: "Caller huglin index bands",
    kind: "matrix",
  },
  {
    id: "independentlyEstablishedDrynessIndexMm",
    label: "Independently established dryness index mm",
    kind: "number",
  },
  {
    id: "independentlyEstablishedHuglinIndex",
    label: "Independently established huglin index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerPairedClimateClassIds, "classes");
  points(input.callerDrynessIndexBandsMm);
  points(input.callerHuglinIndexBands);
  aligned(
    input.callerPairedClimateClassIds,
    input.callerDrynessIndexBandsMm,
    "classes",
  );
  aligned(
    input.callerPairedClimateClassIds,
    input.callerHuglinIndexBands,
    "classes",
  );
  const ids = input.callerPairedClimateClassIds.filter(
    (_, i) =>
      band(
        input.independentlyEstablishedDrynessIndexMm,
        ...(input.callerDrynessIndexBandsMm[i] as [number, number]),
      ) >= 0 &&
      band(
        input.independentlyEstablishedHuglinIndex,
        ...(input.callerHuglinIndexBands[i] as [number, number]),
      ) >= 0,
  );
  input.callerDrynessIndexBandsMm.forEach((r) => band(0, r[0], r[1]));
  input.callerHuglinIndexBands.forEach((r) => band(0, r[0], r[1]));
  return { callerCompatiblePairedClimateClassIds: ids };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPairedClimateClassIds: ["wet-warm", "dry-hot"],
  callerDrynessIndexBandsMm: [
    [0, 100],
    [-100, 0],
  ],
  callerHuglinIndexBands: [
    [1000, 2000],
    [2000, 3000],
  ],
  independentlyEstablishedDrynessIndexMm: -20,
  independentlyEstablishedHuglinIndex: 2500,
} satisfies Input;
export const exampleOutput = {
  callerCompatiblePairedClimateClassIds: ["dry-hot"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/dryness-index-di-huglin-pairing",
  title: "Dryness Index DI Huglin Pairing Checker",
  description:
    "Pair independently established dryness and Huglin indices within caller joint rectangular climate classes, preserving overlap/no match; not recomputing existing climate indices, grape suitability or universal zoning.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatiblePairedClimateClassIds",
      label: "Caller compatible paired climate class ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPairedClimateClassIds:
        value.callerPairedClimateClassIds as readonly string[],
      callerDrynessIndexBandsMm:
        value.callerDrynessIndexBandsMm as readonly (readonly number[])[],
      callerHuglinIndexBands:
        value.callerHuglinIndexBands as readonly (readonly number[])[],
      independentlyEstablishedDrynessIndexMm:
        value.independentlyEstablishedDrynessIndexMm as number,
      independentlyEstablishedHuglinIndex:
        value.independentlyEstablishedHuglinIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
