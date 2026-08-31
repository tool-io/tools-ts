import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  lab,
  labRows,
  unique,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly referenceLab: readonly number[];
  readonly callerBrandLabels: readonly string[];
  readonly callerBrandLabRows: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly rankedCallerBrandLabels: readonly string[];
  readonly rankedCie76Distances: readonly number[];
  readonly rankedOriginalIndices: readonly number[];
}>;
const inputFields = [
  { id: "referenceLab", label: "Reference lab", kind: "numberList" },
  { id: "callerBrandLabels", label: "Caller brand labels", kind: "stringList" },
  { id: "callerBrandLabRows", label: "Caller brand lab rows", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerBrandLabels,
    input.callerBrandLabRows,
    "callerBrandLabels",
  );
  lab(input.referenceLab);
  labRows(input.callerBrandLabRows);
  unique(input.callerBrandLabels, "brands");
  const rows = input.callerBrandLabRows
    .map((v, i) => ({
      i,
      d: Math.hypot(...v.map((x, j) => x - input.referenceLab[j])),
    }))
    .sort((a, b) => a.d - b.d || a.i - b.i);
  return {
    rankedCallerBrandLabels: rows.map((r) => input.callerBrandLabels[r.i]),
    rankedCie76Distances: rows.map((r) => r.d),
    rankedOriginalIndices: rows.map((r) => r.i),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLab: [50, 0, 0],
  callerBrandLabels: ["Far", "Exact"],
  callerBrandLabRows: [
    [60, 0, 0],
    [50, 0, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  rankedCallerBrandLabels: ["Exact", "Far"],
  rankedCie76Distances: [0, 10],
  rankedOriginalIndices: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/brand-color-distance-perceptual-rank",
  title: "Brand Color Perceptual Distance Rank",
  description:
    "Rank actual caller brand reference CIELAB swatches in one white/reference frame by CIE76 distance with stable tie provenance; no invented proprietary brand palette, spectral equivalence or trademark authorization.",
  inputs: inputFields,
  outputs: [
    {
      id: "rankedCallerBrandLabels",
      label: "Ranked caller brand labels",
      kind: "stringList",
    },
    {
      id: "rankedCie76Distances",
      label: "Ranked cie76 distances",
      kind: "numberList",
    },
    {
      id: "rankedOriginalIndices",
      label: "Ranked original indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceLab: value.referenceLab as readonly number[],
      callerBrandLabels: value.callerBrandLabels as readonly string[],
      callerBrandLabRows:
        value.callerBrandLabRows as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
