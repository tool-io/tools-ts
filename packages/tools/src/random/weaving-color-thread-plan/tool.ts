import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  integer,
  strings,
  countsSchema,
  run,
  counts,
  distinct,
  limit,
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
export type WeavingColorThreadPlanInput = AcSeed & {
  readonly warp: readonly ColorStock[];
  readonly weft: readonly ColorStock[];
  readonly lift: readonly (readonly number[])[];
};
export type WeavingColorThreadPlanOutput = AcReplay & {
  readonly warp: readonly string[];
  readonly weft: readonly string[];
  readonly colorIds: readonly string[];
  readonly visibleChart: readonly (readonly number[])[];
  readonly chartJson: string;
  readonly warpCounts: readonly AcCount[];
  readonly weftCounts: readonly AcCount[];
  readonly visibleCounts: readonly AcCount[];
};
export const inputSchema = inputObject({
  warp: colorStockSchema,
  weft: colorStockSchema,
  lift: array(array(integer(0, 1), 16, 1), 16, 1),
});
export const outputSchema = outputObject({
  warp: strings,
  weft: strings,
  colorIds: strings,
  visibleChart: chartSchema,
  chartJson: { type: "string", maxLength: 2048 },
  warpCounts: countsSchema,
  weftCounts: countsSchema,
  visibleCounts: countsSchema,
});
const isInput = (v: unknown): v is WeavingColorThreadPlanInput =>
  matchesModelInput(v, inputSchema);
export const calculateWeavingColorThreadPlan = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<WeavingColorThreadPlanOutput, "randomness"> => {
      distinct(
        x.warp.map((c) => c.id),
        "warp",
      );
      distinct(
        x.weft.map((c) => c.id),
        "weft",
      );
      const width = x.warp.reduce((s, c) => s + c.count, 0),
        height = x.weft.reduce((s, c) => s + c.count, 0);
      if (width < 1 || width > 16 || height < 1 || height > 16)
        return simpleError(
          "warp",
          "Each axis must contain 1 through 16 supplied threads.",
          "invalid_thread_count",
        );
      limit(width * height);
      if (x.lift.length !== height || x.lift.some((r) => r.length !== width))
        return simpleError(
          "lift",
          "Lift rows and columns must match exact weft and warp thread counts.",
          "invalid_lift_shape",
        );
      const colorIds = [...new Set([...x.warp, ...x.weft].map((c) => c.id))];
      limit(colorIds.length, 16, "colors");
      const expand = (colors: readonly ColorStock[]): string[] =>
        colors.flatMap((c) => Array.from({ length: c.count }, () => c.id));
      const warp = random.shuffle(expand(x.warp)),
        weft = random.shuffle(expand(x.weft)),
        visibleChart = x.lift.map((row, r) =>
          row.map((lift, c) =>
            colorIds.indexOf(lift === 1 ? warp[c] : weft[r]),
          ),
        );
      return {
        warp,
        weft,
        colorIds,
        visibleChart,
        chartJson: chartJson(visibleChart),
        warpCounts: counts(
          warp,
          x.warp.map((c) => c.id),
        ),
        weftCounts: counts(
          weft,
          x.weft.map((c) => c.id),
        ),
        visibleCounts: counts(
          visibleChart.flat().map((i) => colorIds[i]),
          colorIds,
        ),
      };
    },
  );
export const weavingColorThreadPlanExample = {
  input: {
    warp: [{ id: "red", count: 2 }],
    weft: [{ id: "blue", count: 2 }],
    lift: [
      [1, 0],
      [0, 1],
    ],
    seed: 42,
  },
  output: {
    warp: ["red", "red"],
    weft: ["blue", "blue"],
    colorIds: ["red", "blue"],
    visibleChart: [
      [0, 1],
      [1, 0],
    ],
    chartJson: "[[0,1],[1,0]]",
    warpCounts: [{ id: "red", count: 2 }],
    weftCounts: [{ id: "blue", count: 2 }],
    visibleCounts: [
      { id: "red", count: 2 },
      { id: "blue", count: 2 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WeavingColorThreadPlanInput,
  WeavingColorThreadPlanOutput
>;
export const weavingColorThreadPlanTool = createModelDefinition<
  WeavingColorThreadPlanInput,
  WeavingColorThreadPlanOutput
>({
  id: "random/weaving-color-thread-plan",
  title: "Random Weaving Color Thread Plan Generator",
  description:
    "Shuffle exact supplied warp/weft color quotas and apply a caller lift matrix to a bounded visible-color grid; fabric behavior and loom setup remain external.",
  inputSchema,
  outputSchema,
  execute: calculateWeavingColorThreadPlan,
});
export const runWeavingColorThreadPlan = weavingColorThreadPlanTool.execute;
export default weavingColorThreadPlanTool;
