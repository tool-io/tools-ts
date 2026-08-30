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
  readonly ppfdGrid: readonly (readonly number[])[];
  readonly cellAreasM2: readonly (readonly number[])[];
  readonly callerMinimumToMeanRatio: number;
  readonly callerMinimumPpfd: number;
}>;
export type Output = Readonly<{
  readonly areaWeightedMeanPpfd: number;
  readonly areaWeightedCv: number;
  readonly minimumToMeanRatio: number;
  readonly areaFractionBelowCallerPpfd: number;
  readonly meetsCallerUniformity: boolean;
}>;
const inputFields = [
  { id: "ppfdGrid", label: "Ppfd grid", kind: "matrix" },
  { id: "cellAreasM2", label: "Cell areas m2", kind: "matrix" },
  {
    id: "callerMinimumToMeanRatio",
    label: "Caller minimum to mean ratio",
    kind: "number",
  },
  { id: "callerMinimumPpfd", label: "Caller minimum ppfd", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const g = input.ppfdGrid,
    a = input.cellAreasM2,
    n = g.length,
    m = g[0]?.length ?? 0;
  if (
    !n ||
    !m ||
    a.length !== n ||
    g.some((row) => row.length !== m) ||
    a.some((row) => row.length !== m)
  )
    simpleError(
      "grids",
      "Aligned nonempty rectangular PPFD and cell-area grids required.",
    );
  fraction(input.callerMinimumToMeanRatio, "callerMinimumToMeanRatio");
  nonnegative(input.callerMinimumPpfd, "callerMinimumPpfd");
  let area = 0,
    sum = 0,
    lo = Infinity,
    below = 0;
  g.forEach((row, i) =>
    row.forEach((v, j) => {
      nonnegative(v, "ppfdGrid");
      positive(a[i][j], "cellAreasM2");
      area += a[i][j];
      sum += v * a[i][j];
      lo = Math.min(lo, v);
      if (v < input.callerMinimumPpfd) below += a[i][j];
    }),
  );
  const areaWeightedMeanPpfd = positive(sum / area, "ppfdGrid"),
    variance =
      g.reduce(
        (s, row, i) =>
          s +
          row.reduce(
            (r, v, j) => r + a[i][j] * (v - areaWeightedMeanPpfd) ** 2,
            0,
          ),
        0,
      ) / area,
    minimumToMeanRatio = lo / areaWeightedMeanPpfd;
  return {
    areaWeightedMeanPpfd,
    areaWeightedCv: Math.sqrt(variance) / areaWeightedMeanPpfd,
    minimumToMeanRatio,
    areaFractionBelowCallerPpfd: below / area,
    meetsCallerUniformity: minimumToMeanRatio >= input.callerMinimumToMeanRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ppfdGrid: [
    [100, 200],
    [300, 400],
  ],
  cellAreasM2: [
    [1, 1],
    [1, 1],
  ],
  callerMinimumToMeanRatio: 0.3,
  callerMinimumPpfd: 150,
} satisfies Input;
export const exampleOutput = {
  areaWeightedMeanPpfd: 250,
  areaWeightedCv: 0.4472135954999579,
  minimumToMeanRatio: 0.4,
  areaFractionBelowCallerPpfd: 0.25,
  meetsCallerUniformity: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/light-uniformity-grid-checker",
  title: "Light Uniformity Grid Checker",
  description:
    "Audit measured light-grid population variability and minimum/mean plus low-light area using physical cell weights; no lamp-layout optimization or universal crop threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedMeanPpfd",
      label: "Area weighted mean ppfd",
      kind: "number",
    },
    { id: "areaWeightedCv", label: "Area weighted cv", kind: "number" },
    {
      id: "minimumToMeanRatio",
      label: "Minimum to mean ratio",
      kind: "number",
    },
    {
      id: "areaFractionBelowCallerPpfd",
      label: "Area fraction below caller ppfd",
      kind: "number",
    },
    {
      id: "meetsCallerUniformity",
      label: "Meets caller uniformity",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      ppfdGrid: value.ppfdGrid as readonly (readonly number[])[],
      cellAreasM2: value.cellAreasM2 as readonly (readonly number[])[],
      callerMinimumToMeanRatio: value.callerMinimumToMeanRatio as number,
      callerMinimumPpfd: value.callerMinimumPpfd as number,
    }),
});
export const run = tool.execute;
export default tool;
