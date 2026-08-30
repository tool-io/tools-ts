import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly broodCellGrid: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedCellCount: number;
  readonly occupiedBroodPercent: number;
  readonly largestEmptyPatchCells: number;
}>;
const inputFields = [
  { id: "broodCellGrid", label: "Brood cell grid", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const g = input.broodCellGrid,
    n = g.length,
    m = g[0]?.length ?? 0;
  if (
    !n ||
    !m ||
    g.some(
      (row) =>
        row.length !== m || row.some((v) => v !== 0 && v !== 1 && v !== 2),
    )
  )
    simpleError(
      "broodCellGrid",
      "Nonempty rectangular grid with 0 outside, 1 occupied brood, 2 empty cells required.",
    );
  let observedCellCount = 0,
    occupied = 0,
    largestEmptyPatchCells = 0;
  const seen = new Set<number>();
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      if (g[i][j] !== 0) observedCellCount++;
      if (g[i][j] === 1) occupied++;
      if (g[i][j] !== 2 || seen.has(i * m + j)) continue;
      const queue = [i * m + j];
      seen.add(i * m + j);
      for (let k = 0; k < queue.length; k++) {
        const r = Math.floor(queue[k] / m),
          c = queue[k] % m;
        for (const [a, b] of [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ])
          if (
            a >= 0 &&
            a < n &&
            b >= 0 &&
            b < m &&
            g[a][b] === 2 &&
            !seen.has(a * m + b)
          ) {
            seen.add(a * m + b);
            queue.push(a * m + b);
          }
      }
      largestEmptyPatchCells = Math.max(largestEmptyPatchCells, queue.length);
    }
  positive(observedCellCount, "broodCellGrid");
  return {
    observedCellCount,
    occupiedBroodPercent: (100 * occupied) / observedCellCount,
    largestEmptyPatchCells,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  broodCellGrid: [
    [1, 1, 1],
    [1, 2, 2],
    [1, 2, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  observedCellCount: 9,
  occupiedBroodPercent: 66.66666666666667,
  largestEmptyPatchCells: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/brood-pattern-solidity-score-percent",
  title: "Brood Pattern Solidity Score Percent",
  description:
    "Measure occupancy and largest four-neighbor empty patch inside a recorded brood-cell grid; excluded cells do not enter the denominator and no queen-health or disease diagnosis is invented.",
  inputs: inputFields,
  outputs: [
    { id: "observedCellCount", label: "Observed cell count", kind: "number" },
    {
      id: "occupiedBroodPercent",
      label: "Occupied brood percent",
      kind: "number",
    },
    {
      id: "largestEmptyPatchCells",
      label: "Largest empty patch cells",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      broodCellGrid: value.broodCellGrid as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
