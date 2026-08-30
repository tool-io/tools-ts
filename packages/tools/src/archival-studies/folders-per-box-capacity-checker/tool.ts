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
  readonly measuredFolderSpineThicknessesMm: readonly number[];
  readonly usableBoxInternalWidthMm: number;
  readonly compressionAllowanceFraction: number;
}>;
export type Output = Readonly<{
  readonly maximumOrderedFolderPrefixCount: number;
  readonly occupiedWidthMm: number;
  readonly remainingInternalWidthMm: number;
}>;
const inputFields = [
  {
    id: "measuredFolderSpineThicknessesMm",
    label: "Measured folder spine thicknesses mm",
    kind: "numberList",
  },
  {
    id: "usableBoxInternalWidthMm",
    label: "Usable box internal width mm",
    kind: "number",
  },
  {
    id: "compressionAllowanceFraction",
    label: "Compression allowance fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredFolderSpineThicknessesMm.forEach((v) =>
    positive(v, "measuredFolderSpineThicknessesMm"),
  );
  nonnegative(input.usableBoxInternalWidthMm, "usableBoxInternalWidthMm");
  fraction(input.compressionAllowanceFraction, "compressionAllowanceFraction");
  if (input.compressionAllowanceFraction === 1)
    simpleError("compression", "Compression fraction below one required.");
  let used = 0,
    n = 0;
  for (const x of input.measuredFolderSpineThicknessesMm) {
    const d = x * (1 - input.compressionAllowanceFraction);
    if (d > input.usableBoxInternalWidthMm - used) break;
    used += d;
    n++;
  }
  return {
    maximumOrderedFolderPrefixCount: n,
    occupiedWidthMm: used,
    remainingInternalWidthMm: input.usableBoxInternalWidthMm - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredFolderSpineThicknessesMm: [2, 3, 5],
  usableBoxInternalWidthMm: 9,
  compressionAllowanceFraction: 0,
} satisfies Input;
export const exampleOutput = {
  maximumOrderedFolderPrefixCount: 2,
  occupiedWidthMm: 5,
  remainingInternalWidthMm: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/folders-per-box-capacity-checker",
  title: "Folder Count per Box Standard Capacity Checker",
  description:
    "Fit an original-order prefix of measured folder thickness into declared usable box width with explicit caller compression allowance; no safe document compression or generic folders-per-box standard.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumOrderedFolderPrefixCount",
      label: "Maximum ordered folder prefix count",
      kind: "number",
    },
    { id: "occupiedWidthMm", label: "Occupied width mm", kind: "number" },
    {
      id: "remainingInternalWidthMm",
      label: "Remaining internal width mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredFolderSpineThicknessesMm:
        value.measuredFolderSpineThicknessesMm as readonly number[],
      usableBoxInternalWidthMm: value.usableBoxInternalWidthMm as number,
      compressionAllowanceFraction:
        value.compressionAllowanceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
