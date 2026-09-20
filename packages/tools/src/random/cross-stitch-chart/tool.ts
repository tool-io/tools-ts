import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import {
  fcArray,
  fcCounts,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type CrossStitchChartInput = FcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly symbols: readonly string[];
  readonly threads: readonly {
    readonly id: string;
    readonly color: string;
    readonly availableStitches: number;
  }[];
};
export type CrossStitchChartOutput = FcReplay & {
  readonly threadGrid: readonly (readonly string[])[];
  readonly symbolGrid: readonly (readonly string[])[];
  readonly legend: readonly {
    readonly id: string;
    readonly color: string;
    readonly symbol: string;
    readonly stitches: number;
    readonly remainingStitches: number;
  }[];
  readonly totalStitches: number;
};
const symbol = { type: "string", minLength: 1, maxLength: 8 } as const;
export const inputSchema = fcInput({
  rows: fcInteger(1, 32),
  columns: fcInteger(1, 32),
  symbols: fcArray(symbol, 64, 1),
  threads: fcArray(
    fcObject({
      id: fcId,
      color: fcText,
      availableStitches: fcInteger(0, 1024),
    }),
    32,
    1,
  ),
});
export const outputSchema = fcOutput({
  threadGrid: fcArray(fcArray(fcId, 32, 1), 32, 1),
  symbolGrid: fcArray(fcArray(symbol, 32, 1), 32, 1),
  legend: fcArray(
    fcObject({
      id: fcId,
      color: fcText,
      symbol,
      stitches: fcInteger(0, 1024),
      remainingStitches: fcInteger(0, 1024),
    }),
    32,
    1,
  ),
  totalStitches: fcInteger(1, 1024),
});
const isInput = (v: unknown): v is CrossStitchChartInput =>
  matchesModelInput(v, inputSchema);
export const calculateCrossStitchChart = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<CrossStitchChartOutput, "randomness"> => {
      fcUnique(
        x.threads.map((t) => t.id),
        "threads",
      );
      fcUnique(x.symbols, "symbols");
      if (x.symbols.length < x.threads.length)
        simpleError(
          "symbols",
          "Supply a distinct legend symbol for every thread.",
          "insufficient_symbols",
        );
      const totalStitches = x.rows * x.columns;
      if (
        x.threads.reduce((s, t) => s + t.availableStitches, 0) < totalStitches
      )
        simpleError(
          "threads",
          "Thread inventory cannot fill the requested stitch grid.",
          "insufficient_thread_inventory",
        );
      const remaining = new Map(
          x.threads.map((t) => [t.id, t.availableStitches]),
        ),
        symbolPool = [...x.symbols];
      const threads = x.threads.map((t) => {
        const assignedSymbol = fcPick(symbolPool, random);
        symbolPool.splice(symbolPool.indexOf(assignedSymbol), 1);
        return { ...t, symbol: assignedSymbol };
      });
      const placements = Array.from({ length: totalStitches }, () => {
        const thread = fcPick(
          threads.filter((t) => (remaining.get(t.id) ?? 0) > 0),
          random,
        );
        remaining.set(thread.id, (remaining.get(thread.id) ?? 0) - 1);
        return thread;
      });
      const counts = fcCounts(
        placements.map((t) => t.id),
        x.threads.map((t) => t.id),
      );
      return {
        threadGrid: Array.from({ length: x.rows }, (_, r) =>
          placements.slice(r * x.columns, (r + 1) * x.columns).map((t) => t.id),
        ),
        symbolGrid: Array.from({ length: x.rows }, (_, r) =>
          placements
            .slice(r * x.columns, (r + 1) * x.columns)
            .map((t) => t.symbol),
        ),
        legend: threads.map((t, i) => ({
          id: t.id,
          color: t.color,
          symbol: t.symbol,
          stitches: counts[i].count,
          remainingStitches: remaining.get(t.id) ?? 0,
        })),
        totalStitches,
      };
    },
  );
export const crossStitchChartExample = {
  input: {
    rows: 2,
    columns: 3,
    symbols: ["X", "O"],
    threads: [
      { id: "red", color: "#c04040", availableStitches: 3 },
      { id: "blue", color: "#4060c0", availableStitches: 3 },
    ],
    seed: 42,
  },
  output: {
    threadGrid: [
      ["blue", "blue", "red"],
      ["blue", "red", "red"],
    ],
    symbolGrid: [
      ["X", "X", "O"],
      ["X", "O", "O"],
    ],
    legend: [
      {
        id: "red",
        color: "#c04040",
        symbol: "O",
        stitches: 3,
        remainingStitches: 0,
      },
      {
        id: "blue",
        color: "#4060c0",
        symbol: "X",
        stitches: 3,
        remainingStitches: 0,
      },
    ],
    totalStitches: 6,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<CrossStitchChartInput, CrossStitchChartOutput>;
export const crossStitchChartTool = createModelDefinition<
  CrossStitchChartInput,
  CrossStitchChartOutput
>({
  id: "random/cross-stitch-chart",
  title: "Random Cross-Stitch Chart Generator",
  description:
    "Assign unique supplied legend symbols to thread inventory and fill a bounded stitch grid while counting and respecting available stitches.",
  inputSchema,
  outputSchema,
  execute: calculateCrossStitchChart,
});
export const runCrossStitchChart = crossStitchChartTool.execute;
export default crossStitchChartTool;
