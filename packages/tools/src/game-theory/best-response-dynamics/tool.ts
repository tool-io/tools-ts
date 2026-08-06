import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BestResponseStep = {
  readonly columnAction: number;
  readonly rowAction: number;
  readonly step: number;
};
export const bestResponseDynamics = (
  rowPayoffs: readonly (readonly number[])[],
  columnPayoffs: readonly (readonly number[])[],
  initialRow: number,
  initialColumn: number,
  iterations: number,
): BestResponseStep[] | null => {
  const rows = rowPayoffs.length,
    columns = rowPayoffs[0]?.length ?? 0;
  if (
    !rows ||
    !columns ||
    rowPayoffs.some((row) => row.length !== columns) ||
    columnPayoffs.length !== rows ||
    columnPayoffs.some((row) => row.length !== columns) ||
    initialRow >= rows ||
    initialColumn >= columns
  )
    return null;
  let rowAction = initialRow,
    columnAction = initialColumn;
  const trace: BestResponseStep[] = [];
  for (let step = 1; step <= iterations; step += 1) {
    rowAction = rowPayoffs.reduce(
      (best, row, index) =>
        row[columnAction]! > rowPayoffs[best]![columnAction]! ? index : best,
      0,
    );
    columnAction = columnPayoffs[rowAction]!.reduce(
      (best, value, index, row) => (value > row[best]! ? index : best),
      0,
    );
    trace.push({ columnAction, rowAction, step });
  }
  return trace;
};
export const bestResponseDynamicsExample = {
  input: {
    columnPayoffs: [
      [2, 0],
      [0, 1],
    ],
    initialColumn: 1,
    initialRow: 0,
    iterations: 3,
    rowPayoffs: [
      [2, 0],
      [0, 1],
    ],
  },
  output: {
    trace: {
      values: [
        { columnAction: 1, rowAction: 1, step: 1 },
        { columnAction: 1, rowAction: 1, step: 2 },
        { columnAction: 1, rowAction: 1, step: 3 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly columnPayoffs: readonly (readonly number[])[];
    readonly initialColumn: number;
    readonly initialRow: number;
    readonly iterations: number;
    readonly rowPayoffs: readonly (readonly number[])[];
  },
  { readonly trace: { readonly values: readonly BestResponseStep[] } }
>;
export const bestResponseDynamicsTool = createSimpleTool({
  id: "game-theory/best-response-dynamics",
  title: "Best-Response Dynamics Demonstrator",
  description:
    "Iteratively choose pure best responses in a two-player normal-form game.",
  inputs: [
    {
      format: "matrix/payoff-row",
      id: "rowPayoffs",
      kind: "matrix",
      label: "Row-player payoffs",
    },
    {
      format: "matrix/payoff-column",
      id: "columnPayoffs",
      kind: "matrix",
      label: "Column-player payoffs",
    },
    {
      id: "initialRow",
      kind: "integer",
      label: "Initial row action",
      minimum: 0,
    },
    {
      id: "initialColumn",
      kind: "integer",
      label: "Initial column action",
      minimum: 0,
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 10_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "game-theory/best-response-trace",
      id: "trace",
      kind: "object",
      label: "Best-response trace",
    },
  ],
  calculate: (input) => {
    const values = bestResponseDynamics(
      input.rowPayoffs as number[][],
      input.columnPayoffs as number[][],
      input.initialRow as number,
      input.initialColumn as number,
      input.iterations as number,
    );
    if (!values)
      return simpleError(
        "rowPayoffs",
        "Payoff matrices must have matching nonempty dimensions and valid starting actions.",
      );
    return { trace: { values } };
  },
});
export const runBestResponseDynamics = bestResponseDynamicsTool.execute;
export default bestResponseDynamicsTool;
