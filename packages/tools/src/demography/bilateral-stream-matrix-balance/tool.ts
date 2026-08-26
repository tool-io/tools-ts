import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BilateralStreamMatrixBalanceInput = {
  readonly streams: readonly number[][];
};

export type BilateralStreamMatrixBalanceOutput = {
  readonly outTotals: number[];
  readonly inTotals: number[];
  readonly netInflow: number[];
  readonly totalMigrants: number;
};

const isMatrix = (
  value: readonly unknown[],
): value is readonly (readonly number[])[] =>
  value.every(
    (row) =>
      Array.isArray(row) &&
      row.length === value.length &&
      row.every(
        (entry) =>
          typeof entry === "number" && Number.isFinite(entry) && entry >= 0,
      ),
  );

export const calculateBilateralStreamMatrixBalance = (
  input: BilateralStreamMatrixBalanceInput,
): BilateralStreamMatrixBalanceOutput => {
  const matrix = input.streams;
  if (!Array.isArray(matrix) || matrix.length === 0 || !isMatrix(matrix))
    simpleError(
      "streams",
      "Provide a square, non-negative numeric origin-destination matrix.",
      "invalid_matrix",
    );
  const size = matrix.length;
  const outTotals = Array.from({ length: size }, () => 0);
  const inTotals = Array.from({ length: size }, () => 0);
  let totalMigrants = 0;
  for (let origin = 0; origin < size; origin += 1)
    for (let destination = 0; destination < size; destination += 1) {
      const flow = matrix[origin]![destination]!;
      outTotals[origin]! += flow;
      inTotals[destination]! += flow;
      totalMigrants += flow;
    }
  return {
    outTotals: [...outTotals],
    inTotals: [...inTotals],
    netInflow: inTotals.map((value, index) => value - outTotals[index]!),
    totalMigrants,
  };
};

export const bilateralStreamMatrixBalanceExample = {
  input: {
    streams: [
      [0, 100, 50],
      [40, 0, 30],
      [20, 60, 0],
    ],
  },
  output: {
    outTotals: [150, 70, 80],
    inTotals: [60, 160, 80],
    netInflow: [-90, 90, 0],
    totalMigrants: 300,
  },
} satisfies ToolExample<
  BilateralStreamMatrixBalanceInput,
  BilateralStreamMatrixBalanceOutput
>;

export const bilateralStreamMatrixBalanceTool = createSimpleTool({
  id: "demography/bilateral-stream-matrix-balance",
  title: "Bilateral Stream Matrix Balance",
  description:
    "Sum an origin-destination migration matrix into out-migration totals per origin, in-migration totals per destination, net inflow per region and the grand total of movers.",
  inputs: [
    {
      description:
        "Square matrix whose rows are origins and columns are destinations.",
      id: "streams",
      kind: "matrix",
      label: "Streams",
    },
  ],
  outputs: [
    {
      description: "Out-migration totals for each region of origin.",
      id: "outTotals",
      kind: "numberList",
      label: "Out totals",
    },
    {
      description: "In-migration totals for each destination.",
      id: "inTotals",
      kind: "numberList",
      label: "In totals",
    },
    {
      description:
        "Net inflow per region, positive when arrivals exceed departures.",
      id: "netInflow",
      kind: "numberList",
      label: "Net inflow",
    },
    {
      description: "Total migrants across all streams.",
      id: "totalMigrants",
      kind: "number",
      label: "Total",
    },
  ],
  calculate: (input) =>
    calculateBilateralStreamMatrixBalance(
      input as unknown as BilateralStreamMatrixBalanceInput,
    ),
});

export const runBilateralStreamMatrixBalance =
  bilateralStreamMatrixBalanceTool.execute;
export default bilateralStreamMatrixBalanceTool;
