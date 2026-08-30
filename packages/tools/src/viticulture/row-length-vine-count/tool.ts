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
  count,
  aligned,
  shape,
  integerSpan,
} from "../shared.js";
export type Input = Readonly<{
  readonly rowLengthsM: readonly number[];
  readonly inRowVineSpacingsM: readonly number[];
  readonly startEndInsetsM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly vinePositionsByRowCounts: readonly number[];
  readonly totalGeometricVinePositions: number;
}>;
const inputFields = [
  { id: "rowLengthsM", label: "Row lengths m", kind: "numberList" },
  {
    id: "inRowVineSpacingsM",
    label: "In row vine spacings m",
    kind: "numberList",
  },
  { id: "startEndInsetsM", label: "Start end insets m", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.inRowVineSpacingsM.forEach((v) => positive(v, "inRowVineSpacingsM"));
  input.rowLengthsM.forEach((v) => nonnegative(v, "rowLengthsM"));
  aligned(input.rowLengthsM, input.inRowVineSpacingsM, "rowLengthsM");
  aligned(input.rowLengthsM, input.startEndInsetsM, "rowLengthsM");
  if (shape(input.startEndInsetsM, "insets") !== 2)
    simpleError("insets", "Two end insets per row required.");
  const vinePositionsByRowCounts = input.rowLengthsM.map((l, i) =>
    integerSpan(
      l,
      input.inRowVineSpacingsM[i],
      input.startEndInsetsM[i][0],
      input.startEndInsetsM[i][1],
    ),
  );
  const totalGeometricVinePositions = vinePositionsByRowCounts.reduce(
    (a, b) => a + b,
    0,
  );
  count(totalGeometricVinePositions, "totalPositions");
  return { vinePositionsByRowCounts, totalGeometricVinePositions };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rowLengthsM: [10, 20],
  inRowVineSpacingsM: [2, 3],
  startEndInsetsM: [
    [1, 1],
    [1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  vinePositionsByRowCounts: [5, 7],
  totalGeometricVinePositions: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/row-length-vine-count",
  title: "Row Length Vine Count",
  description:
    "Count endpoint-inclusive geometric vine positions for unequal measured row lengths, spacings and end exclusions; no area-density alias, field planting recommendation or rounding fractional plants.",
  inputs: inputFields,
  outputs: [
    {
      id: "vinePositionsByRowCounts",
      label: "Vine positions by row counts",
      kind: "numberList",
    },
    {
      id: "totalGeometricVinePositions",
      label: "Total geometric vine positions",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rowLengthsM: value.rowLengthsM as readonly number[],
      inRowVineSpacingsM: value.inRowVineSpacingsM as readonly number[],
      startEndInsetsM: value.startEndInsetsM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
