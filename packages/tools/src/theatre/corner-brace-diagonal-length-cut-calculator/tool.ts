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
  bounded,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly cornerBraceLegXM: number;
  readonly cornerBraceLegYM: number;
  readonly endSetbackAlongDiagonalM: number;
  readonly braceCount: number;
}>;
export type Output = Readonly<{
  readonly geometricDiagonalM: number;
  readonly finishedBraceCutLengthM: number;
  readonly totalBraceCutLengthM: number;
}>;
const inputFields = [
  { id: "cornerBraceLegXM", label: "Corner brace leg x m", kind: "number" },
  { id: "cornerBraceLegYM", label: "Corner brace leg y m", kind: "number" },
  {
    id: "endSetbackAlongDiagonalM",
    label: "End setback along diagonal m",
    kind: "number",
  },
  { id: "braceCount", label: "Brace count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cornerBraceLegXM, "cornerBraceLegXM");
  positive(input.cornerBraceLegYM, "cornerBraceLegYM");
  nonnegative(input.endSetbackAlongDiagonalM, "endSetbackAlongDiagonalM");
  bounded(input.braceCount, "count", 1, 128);
  const diagonal = Math.hypot(input.cornerBraceLegXM, input.cornerBraceLegYM),
    cut = diagonal - 2 * input.endSetbackAlongDiagonalM;
  if (cut <= 0) simpleError("setback", "End setbacks exhaust brace length.");
  return {
    geometricDiagonalM: diagonal,
    finishedBraceCutLengthM: cut,
    totalBraceCutLengthM: cut * input.braceCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cornerBraceLegXM: 0.3,
  cornerBraceLegYM: 0.4,
  endSetbackAlongDiagonalM: 0.05,
  braceCount: 2,
} satisfies Input;
export const exampleOutput = {
  geometricDiagonalM: 0.5,
  finishedBraceCutLengthM: 0.4,
  totalBraceCutLengthM: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/corner-brace-diagonal-length-cut-calculator",
  title: "Corner Brace Diagonal Length Cut Calculator",
  description:
    "Budget actual scenic brace diagonal cut length after explicitly measured along-diagonal end setbacks; no bevel/miter angle, joint strength or universal corner brace sizing.",
  inputs: inputFields,
  outputs: [
    { id: "geometricDiagonalM", label: "Geometric diagonal m", kind: "number" },
    {
      id: "finishedBraceCutLengthM",
      label: "Finished brace cut length m",
      kind: "number",
    },
    {
      id: "totalBraceCutLengthM",
      label: "Total brace cut length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cornerBraceLegXM: value.cornerBraceLegXM as number,
      cornerBraceLegYM: value.cornerBraceLegYM as number,
      endSetbackAlongDiagonalM: value.endSetbackAlongDiagonalM as number,
      braceCount: value.braceCount as number,
    }),
});
export const run = tool.execute;
export default tool;
