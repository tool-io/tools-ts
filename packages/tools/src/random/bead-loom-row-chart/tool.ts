import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  integer,
  strings,
  object,
  label,
  countsSchema,
  run,
  choices,
  budget,
  counts,
  distinct,
  limit,
  finite,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  colorStockSchema,
  chartSchema,
  chartJson,
  type ColorStock,
} from "../m500b-art-craft-textile.js";
export type BeadLoomRowChartInput = AcSeed & {
  readonly colors: readonly ColorStock[];
  readonly rows: number;
  readonly columns: number;
  readonly maximumRun: number;
};
export type BeadLoomRowChartOutput = AcReplay & {
  readonly colorIds: readonly string[];
  readonly chart: readonly (readonly number[])[];
  readonly chartJson: string;
  readonly colorCounts: readonly AcCount[];
  readonly remaining: readonly ColorStock[];
};
export const inputSchema = inputObject({
  colors: colorStockSchema,
  rows: integer(1, 16),
  columns: integer(1, 16),
  maximumRun: integer(1, 16),
});
export const outputSchema = outputObject({
  colorIds: strings,
  chart: chartSchema,
  chartJson: { type: "string", maxLength: 2048 },
  colorCounts: countsSchema,
  remaining: colorStockSchema,
});
const isInput = (v: unknown): v is BeadLoomRowChartInput =>
  matchesModelInput(v, inputSchema);
export const calculateBeadLoomRowChart = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<BeadLoomRowChartOutput, "randomness"> => {
      distinct(
        x.colors.map((c) => c.id),
        "colors",
      );
      const n = x.rows * x.columns;
      limit(n);
      if (x.colors.reduce((s, c) => s + c.count, 0) < n)
        return simpleError(
          "colors",
          "Color inventory is smaller than the requested chart.",
          "insufficient_inventory",
        );
      const remaining = x.colors.map((c) => c.count),
        cells: number[] = [],
        tick = budget();
      const search = (): boolean => {
        tick();
        const i = cells.length;
        if (i === n) return true;
        const column = i % x.columns,
          previous = cells[i - 1];
        let runLength = 0;
        for (let k = 1; k <= column && cells[i - k] === previous; k++)
          runLength++;
        const eligible = x.colors
          .map((_, j) => j)
          .filter(
            (j) =>
              remaining[j] > 0 &&
              !(column > 0 && j === previous && runLength >= x.maximumRun),
          );
        for (const j of choices(eligible, random)) {
          remaining[j]--;
          cells.push(j);
          if (search()) return true;
          cells.pop();
          remaining[j]++;
        }
        return false;
      };
      if (!search())
        return simpleError(
          "colors",
          "Inventory and per-row run rules have no feasible chart.",
          "infeasible_chart",
        );
      const colorIds = x.colors.map((c) => c.id),
        chart = Array.from({ length: x.rows }, (_, r) =>
          cells.slice(r * x.columns, (r + 1) * x.columns),
        );
      return {
        colorIds,
        chart,
        chartJson: chartJson(chart),
        colorCounts: counts(
          cells.map((j) => colorIds[j]),
          colorIds,
        ),
        remaining: x.colors.map((c, j) => ({
          id: c.id,
          count: finite(remaining[j]),
        })),
      };
    },
  );
export const beadLoomRowChartExample = {
  input: {
    colors: [
      { id: "red", count: 2 },
      { id: "blue", count: 2 },
    ],
    rows: 1,
    columns: 3,
    maximumRun: 1,
    seed: 42,
  },
  output: {
    colorIds: ["red", "blue"],
    chart: [[1, 0, 1]],
    chartJson: "[[1,0,1]]",
    colorCounts: [
      { id: "red", count: 1 },
      { id: "blue", count: 2 },
    ],
    remaining: [
      { id: "red", count: 1 },
      { id: "blue", count: 0 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<BeadLoomRowChartInput, BeadLoomRowChartOutput>;
export const beadLoomRowChartTool = createModelDefinition<
  BeadLoomRowChartInput,
  BeadLoomRowChartOutput
>({
  id: "random/bead-loom-row-chart",
  title: "Random Bead Loom Row Chart Generator",
  description:
    "Construct an exact numeric-index bead chart from finite caller color stock under per-row repeat bounds, retaining compact matrix JSON and inventory conservation.",
  inputSchema,
  outputSchema,
  execute: calculateBeadLoomRowChart,
});
export const runBeadLoomRowChart = beadLoomRowChartTool.execute;
export default beadLoomRowChartTool;
