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
  fraction,
  shape,
  safeCeil,
  grid,
  at,
} from "../shared.js";
export type Input = Readonly<{
  readonly walkableCellBoard: readonly (readonly number[])[];
  readonly visitedCellCoordinates: readonly (readonly number[])[];
  readonly callerTargetCarveFraction: number;
}>;
export type Output = Readonly<{
  readonly distinctVisitedWalkableCells: number;
  readonly totalDeclaredWalkableCells: number;
  readonly observedVisitedSharePercent: number;
  readonly additionalUniqueCellsToCallerTarget: number;
  readonly callerTargetMet: boolean;
}>;
const inputFields = [
  { id: "walkableCellBoard", label: "Walkable cell board", kind: "matrix" },
  {
    id: "visitedCellCoordinates",
    label: "Visited cell coordinates",
    kind: "matrix",
  },
  {
    id: "callerTargetCarveFraction",
    label: "Caller target carve fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.callerTargetCarveFraction, "callerTargetCarveFraction");
  grid(input.walkableCellBoard, [0, 1]);
  if (shape(input.visitedCellCoordinates, "visited") !== 2)
    simpleError("visited", "Observed row/column visit pairs required.");
  const seen = new Set<string>();
  input.visitedCellCoordinates.forEach(([r, c]) => {
    if (at(input.walkableCellBoard, r, c) !== 1)
      simpleError("visit", "Every visit must lie in declared walkable cells.");
    seen.add(r + "," + c);
  });
  const total = positive(
      input.walkableCellBoard.flat().reduce((a, b) => a + b, 0),
      "walkableCells",
    ),
    target = safeCeil(total * input.callerTargetCarveFraction, "target");
  return {
    distinctVisitedWalkableCells: seen.size,
    totalDeclaredWalkableCells: total,
    observedVisitedSharePercent: (100 * seen.size) / total,
    additionalUniqueCellsToCallerTarget: Math.max(0, target - seen.size),
    callerTargetMet: seen.size >= target,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  walkableCellBoard: [
    [1, 1],
    [1, 0],
  ],
  visitedCellCoordinates: [
    [0, 0],
    [0, 0],
  ],
  callerTargetCarveFraction: 1,
} satisfies Input;
export const exampleOutput = {
  distinctVisitedWalkableCells: 1,
  totalDeclaredWalkableCells: 3,
  observedVisitedSharePercent: 33.333333333333336,
  additionalUniqueCellsToCallerTarget: 2,
  callerTargetMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/procgen-random-walk-carve-percent-target",
  title: "Random-Walk Carve Percent Target (Procgen)",
  description:
    "Audit actual random-walk visit ledger against declared walkable cells and caller carve fraction, counting unique cells rather than steps; no connectivity/reachability or stopping-time guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctVisitedWalkableCells",
      label: "Distinct visited walkable cells",
      kind: "number",
    },
    {
      id: "totalDeclaredWalkableCells",
      label: "Total declared walkable cells",
      kind: "number",
    },
    {
      id: "observedVisitedSharePercent",
      label: "Observed visited share percent",
      kind: "number",
    },
    {
      id: "additionalUniqueCellsToCallerTarget",
      label: "Additional unique cells to caller target",
      kind: "number",
    },
    { id: "callerTargetMet", label: "Caller target met", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      walkableCellBoard:
        value.walkableCellBoard as readonly (readonly number[])[],
      visitedCellCoordinates:
        value.visitedCellCoordinates as readonly (readonly number[])[],
      callerTargetCarveFraction: value.callerTargetCarveFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
