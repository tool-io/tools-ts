import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  matrixFlags,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerObservedLampCoverageFlags: readonly (readonly number[])[];
  readonly canopyCellAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly coveredCanopyAreaM2: number;
  readonly uncoveredCanopyAreaM2: number;
  readonly multipleLampCoveredAreaM2: number;
  readonly coverageCountsByCell: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedLampCoverageFlags",
    label: "Caller observed lamp coverage flags",
    kind: "matrix",
  },
  {
    id: "canopyCellAreasM2",
    label: "Canopy cell areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.canopyCellAreasM2.forEach((v) => positive(v, "canopyCellAreasM2"));
  matrixFlags(
    input.callerObservedLampCoverageFlags,
    input.canopyCellAreasM2.length,
  );
  const counts = input.canopyCellAreasM2.map((_, c) =>
    sum(input.callerObservedLampCoverageFlags.map((r) => r[c])),
  );
  return {
    coveredCanopyAreaM2: sum(
      input.canopyCellAreasM2.filter((_, i) => counts[i] > 0),
    ),
    uncoveredCanopyAreaM2: sum(
      input.canopyCellAreasM2.filter((_, i) => counts[i] === 0),
    ),
    multipleLampCoveredAreaM2: sum(
      input.canopyCellAreasM2.filter((_, i) => counts[i] > 1),
    ),
    coverageCountsByCell: counts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedLampCoverageFlags: [
    [1, 0, 1],
    [0, 1, 1],
  ],
  canopyCellAreasM2: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  coveredCanopyAreaM2: 4,
  uncoveredCanopyAreaM2: 0,
  multipleLampCoveredAreaM2: 1,
  coverageCountsByCell: [1, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/grow-light-footprint-coverage",
  title: "Grow Light Footprint Coverage Calculator",
  description:
    "Inventory actual caller independently mapped lamp footprints and overlap on canopy cells; not lamp-count area division, PPFD uniformity, optical layout optimization or automatic mapping.",
  inputs: inputFields,
  outputs: [
    {
      id: "coveredCanopyAreaM2",
      label: "Covered canopy area m2",
      kind: "number",
    },
    {
      id: "uncoveredCanopyAreaM2",
      label: "Uncovered canopy area m2",
      kind: "number",
    },
    {
      id: "multipleLampCoveredAreaM2",
      label: "Multiple lamp covered area m2",
      kind: "number",
    },
    {
      id: "coverageCountsByCell",
      label: "Coverage counts by cell",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedLampCoverageFlags:
        value.callerObservedLampCoverageFlags as readonly (readonly number[])[],
      canopyCellAreasM2: value.canopyCellAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
