import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly runLengths: readonly number[];
  readonly availableLineCells: number;
  readonly fixedLeadingEmptyCells: number;
  readonly fixedTrailingEmptyCells: number;
}>;
export type Output = Readonly<{
  readonly minimumRequiredLineCells: number;
  readonly signedRemainingSlackCells: number;
  readonly lineLengthFeasible: boolean;
}>;
const inputFields = [
  { id: "runLengths", label: "Run lengths", kind: "numberList" },
  { id: "availableLineCells", label: "Available line cells", kind: "number" },
  {
    id: "fixedLeadingEmptyCells",
    label: "Fixed leading empty cells",
    kind: "number",
  },
  {
    id: "fixedTrailingEmptyCells",
    label: "Fixed trailing empty cells",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.runLengths.forEach((v) => positive(v, "runLengths"));
  count(input.availableLineCells, "availableLineCells");
  count(input.fixedLeadingEmptyCells, "fixedLeadingEmptyCells");
  count(input.fixedTrailingEmptyCells, "fixedTrailingEmptyCells");
  input.runLengths.forEach((v) => count(v, "run"));
  const min = count(
      totalCount(input.runLengths, "runs") +
        Math.max(0, input.runLengths.length - 1) +
        input.fixedLeadingEmptyCells +
        input.fixedTrailingEmptyCells,
      "span",
    ),
    slack = input.availableLineCells - min;
  return {
    minimumRequiredLineCells: min,
    signedRemainingSlackCells: slack,
    lineLengthFeasible: slack >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  runLengths: [3, 2],
  availableLineCells: 8,
  fixedLeadingEmptyCells: 0,
  fixedTrailingEmptyCells: 0,
} satisfies Input;
export const exampleOutput = {
  minimumRequiredLineCells: 6,
  signedRemainingSlackCells: 2,
  lineLengthFeasible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/nonogram-clue-sum-plus-gaps-length-checker",
  title: "Nonogram Clue Sum + Gaps Length Check",
  description:
    "Audit Nonogram clue sum plus one mandatory gap between runs and explicit exterior empties, including empty clue; preserves signed deficit, not cellwise consistency or uniqueness solving.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumRequiredLineCells",
      label: "Minimum required line cells",
      kind: "number",
    },
    {
      id: "signedRemainingSlackCells",
      label: "Signed remaining slack cells",
      kind: "number",
    },
    {
      id: "lineLengthFeasible",
      label: "Line length feasible",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      runLengths: value.runLengths as readonly number[],
      availableLineCells: value.availableLineCells as number,
      fixedLeadingEmptyCells: value.fixedLeadingEmptyCells as number,
      fixedTrailingEmptyCells: value.fixedTrailingEmptyCells as number,
    }),
});
export const run = tool.execute;
export default tool;
