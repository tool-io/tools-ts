import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  shape,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly processInkPercentRows: readonly (readonly number[])[];
  readonly callerTotalInkCoverageCeilingPercent: number;
}>;
export type Output = Readonly<{
  readonly totalInkCoveragePercents: readonly number[];
  readonly excessCoveragePercentagePoints: readonly number[];
  readonly overCallerInkLimitRowIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "processInkPercentRows",
    label: "Process ink percent rows",
    kind: "matrix",
  },
  {
    id: "callerTotalInkCoverageCeilingPercent",
    label: "Caller total ink coverage ceiling percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerTotalInkCoverageCeilingPercent,
    "callerTotalInkCoverageCeilingPercent",
  );
  if (
    !input.processInkPercentRows.length ||
    shape(input.processInkPercentRows, "inks") !== 4 ||
    input.callerTotalInkCoverageCeilingPercent > 400
  )
    simpleError(
      "ink",
      "CMYK rows and caller total-ink limit in [0,400] required.",
    );
  input.processInkPercentRows.forEach((r) =>
    r.forEach((v) => {
      if (v < 0 || v > 100)
        simpleError("ink", "Each ink percentage in [0,100] required.");
    }),
  );
  const totals = input.processInkPercentRows.map(sum);
  return {
    totalInkCoveragePercents: totals,
    excessCoveragePercentagePoints: totals.map((v) =>
      Math.max(0, v - input.callerTotalInkCoverageCeilingPercent),
    ),
    overCallerInkLimitRowIndices: totals.flatMap((v, i) =>
      v > input.callerTotalInkCoverageCeilingPercent ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  processInkPercentRows: [
    [100, 100, 100, 100],
    [20, 30, 40, 50],
  ],
  callerTotalInkCoverageCeilingPercent: 300,
} satisfies Input;
export const exampleOutput = {
  totalInkCoveragePercents: [400, 140],
  excessCoveragePercentagePoints: [100, 0],
  overCallerInkLimitRowIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/print-ink-coverage-total-area-limit-checker",
  title: "Total Ink Coverage Area Limit Check",
  description:
    "Audit actual CMYK separations for summed total-ink coverage against caller substrate/press ceiling; not an invented universal ink limit, automatic black replacement or print-profile conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalInkCoveragePercents",
      label: "Total ink coverage percents",
      kind: "numberList",
    },
    {
      id: "excessCoveragePercentagePoints",
      label: "Excess coverage percentage points",
      kind: "numberList",
    },
    {
      id: "overCallerInkLimitRowIndices",
      label: "Over caller ink limit row indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      processInkPercentRows:
        value.processInkPercentRows as readonly (readonly number[])[],
      callerTotalInkCoverageCeilingPercent:
        value.callerTotalInkCoverageCeilingPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
