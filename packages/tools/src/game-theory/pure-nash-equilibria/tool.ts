import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PureNashEquilibrium = {
  readonly columnPayoff: number;
  readonly columnStrategy: number;
  readonly rowPayoff: number;
  readonly rowStrategy: number;
};
export type PureNashResult = {
  readonly columnStrategies: number;
  readonly equilibria: readonly PureNashEquilibrium[];
  readonly equilibriumCount: number;
  readonly rowStrategies: number;
};

export const calculatePureNashEquilibria = (
  rowPayoffs: readonly (readonly number[])[],
  columnPayoffs: readonly (readonly number[])[],
): PureNashResult => {
  const rows = rowPayoffs.length;
  const columns = rowPayoffs[0]?.length ?? 0;
  if (rows === 0 || columns === 0)
    simpleError("rowPayoffs", "Payoff matrices must not be empty.");
  if (
    rowPayoffs.some((row) => row.length !== columns) ||
    columnPayoffs.length !== rows ||
    columnPayoffs.some((row) => row.length !== columns)
  )
    simpleError(
      "columnPayoffs",
      "Both payoff matrices must have the same non-ragged dimensions.",
    );
  const equilibria: PureNashEquilibrium[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const rowBest = rowPayoffs.every(
        (candidate) => candidate[column]! <= rowPayoffs[row]![column]!,
      );
      const columnBest = columnPayoffs[row]!.every(
        (candidate) => candidate <= columnPayoffs[row]![column]!,
      );
      if (rowBest && columnBest)
        equilibria.push({
          columnPayoff: columnPayoffs[row]![column]!,
          columnStrategy: column,
          rowPayoff: rowPayoffs[row]![column]!,
          rowStrategy: row,
        });
    }
  }
  return {
    columnStrategies: columns,
    equilibria,
    equilibriumCount: equilibria.length,
    rowStrategies: rows,
  };
};

const exampleInput = {
  columnPayoffs: [
    [3, 0],
    [5, 1],
  ],
  rowPayoffs: [
    [3, 5],
    [0, 1],
  ],
} as const;
export const pureNashEquilibriaExample = {
  input: exampleInput,
  output: {
    result: calculatePureNashEquilibria(
      exampleInput.rowPayoffs,
      exampleInput.columnPayoffs,
    ),
  },
} satisfies ToolExample<
  {
    readonly columnPayoffs: readonly (readonly number[])[];
    readonly rowPayoffs: readonly (readonly number[])[];
  },
  { readonly result: PureNashResult }
>;

export const pureNashEquilibriaTool = createSimpleTool({
  calculate: (input) => ({
    result: calculatePureNashEquilibria(
      input.rowPayoffs as number[][],
      input.columnPayoffs as number[][],
    ),
  }),
  description:
    "Find every pure-strategy Nash equilibrium in a finite two-player normal-form game, including tied best responses. Strategy indices are zero-based; mixed-strategy equilibria are not computed.",
  id: "game-theory/pure-nash-equilibria",
  inputs: [
    { id: "rowPayoffs", kind: "matrix", label: "Row-player payoff matrix" },
    {
      id: "columnPayoffs",
      kind: "matrix",
      label: "Column-player payoff matrix",
    },
  ],
  outputs: [
    {
      format: "game-theory/pure-nash-result",
      id: "result",
      kind: "object",
      label: "Pure Nash equilibria",
    },
  ],
  title: "Pure-Strategy Nash Equilibrium Calculator",
});
export const runPureNashEquilibria = pureNashEquilibriaTool.execute;
export default pureNashEquilibriaTool;
