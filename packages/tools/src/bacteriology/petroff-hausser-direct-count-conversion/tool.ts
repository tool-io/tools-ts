import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  mean,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly cellsPerCountedSquare: readonly number[];
  readonly actualSquareAreaMm2: number;
  readonly actualChamberDepthMm: number;
  readonly dilutionDivisor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "cellsPerCountedSquare",
    label: "Cells per counted square",
    kind: "numberList",
  },
  {
    id: "actualSquareAreaMm2",
    label: "Actual square area mm2",
    kind: "number",
  },
  {
    id: "actualChamberDepthMm",
    label: "Actual chamber depth mm",
    kind: "number",
  },
  { id: "dilutionDivisor", label: "Dilution divisor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (!i.cellsPerCountedSquare.length)
    simpleError("counts", "Actual counted squares.");
  i.cellsPerCountedSquare.forEach((v) => bounded(v, "count", 0, 1000000000));
  positive(i.actualSquareAreaMm2, "area");
  positive(i.actualChamberDepthMm, "depth");
  positive(i.dilutionDivisor, "dilution");
  return {
    cellsPerMl:
      (mean(i.cellsPerCountedSquare) * 1000 * i.dilutionDivisor) /
      (i.actualSquareAreaMm2 * i.actualChamberDepthMm),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    cellsPerCountedSquare: [10, 20],
    actualSquareAreaMm2: 0.0025,
    actualChamberDepthMm: 0.02,
    dilutionDivisor: 1,
  },
  output: { result: { cellsPerMl: 300000000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/petroff-hausser-direct-count-conversion",
  title: "Petroff-Hausser Direct Count Conversion Calculator",
  description:
    "Actual Petroff-Hausser observed square counts with actual chamber geometry, not assumed generic hemocytometer depth; viable fraction/detection artifacts omitted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
