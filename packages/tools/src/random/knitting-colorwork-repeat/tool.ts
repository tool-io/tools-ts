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
  choices,
  budget,
  distinct,
  counts,
  limit,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { chartSchema, chartJson } from "../m500b-art-craft-textile.js";
export type KnittingColorworkRepeatInput = AcSeed & {
  readonly colors: readonly string[];
  readonly rows: number;
  readonly columns: number;
  readonly maximumFloat: number;
};
export type KnittingColorworkRepeatOutput = AcReplay & {
  readonly colorIds: readonly string[];
  readonly chart: readonly (readonly number[])[];
  readonly chartJson: string;
  readonly colorCounts: readonly AcCount[];
  readonly longestCircularFloatByRow: readonly number[];
};
export const inputSchema = inputObject({
  colors: array({ type: "string", minLength: 1, maxLength: 80 }, 2, 2),
  rows: integer(1, 16),
  columns: integer(2, 16),
  maximumFloat: integer(1, 16),
});
export const outputSchema = outputObject({
  colorIds: strings,
  chart: chartSchema,
  chartJson: { type: "string", maxLength: 2048 },
  colorCounts: countsSchema,
  longestCircularFloatByRow: array(integer(1, 15), 16, 1),
});
const isInput = (v: unknown): v is KnittingColorworkRepeatInput =>
  matchesModelInput(v, inputSchema);
const circularFloat = (row: readonly number[]): number => {
  if (!row.includes(0) || !row.includes(1)) return row.length;
  let longest = 0;
  for (const color of [0, 1])
    for (let start = 0; start < row.length; start++) {
      let n = 0;
      while (n < row.length && row[(start + n) % row.length] !== color) n++;
      longest = Math.max(longest, n);
    }
  return longest;
};
export const calculateKnittingColorworkRepeat = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<KnittingColorworkRepeatOutput, "randomness"> => {
      distinct(x.colors, "colors");
      limit(x.rows * x.columns);
      const chart: number[][] = [],
        tick = budget();
      for (let r = 0; r < x.rows; r++) {
        const row: number[] = [];
        const search = (): boolean => {
          tick();
          if (row.length === x.columns)
            return (
              circularFloat(row) <= x.maximumFloat &&
              row.includes(0) &&
              row.includes(1)
            );
          let repeated = 0;
          for (
            let i = row.length - 1;
            i >= 0 && row[i] === row[row.length - 1];
            i--
          )
            repeated++;
          for (const color of choices(
            [0, 1].filter(
              (c) => !(c === row[row.length - 1] && repeated >= x.maximumFloat),
            ),
            random,
          )) {
            row.push(color);
            if (search()) return true;
            row.pop();
          }
          return false;
        };
        if (!search())
          return simpleError(
            "maximumFloat",
            "No two-color cyclic row satisfies both yarn float bounds.",
            "infeasible_chart",
          );
        chart.push(row);
      }
      return {
        colorIds: [...x.colors],
        chart,
        chartJson: chartJson(chart),
        colorCounts: counts(
          chart.flat().map((i) => x.colors[i]),
          x.colors,
        ),
        longestCircularFloatByRow: chart.map(circularFloat),
      };
    },
  );
export const knittingColorworkRepeatExample = {
  input: {
    colors: ["red", "blue"],
    rows: 1,
    columns: 4,
    maximumFloat: 1,
    seed: 42,
  },
  output: {
    colorIds: ["red", "blue"],
    chart: [[1, 0, 1, 0]],
    chartJson: "[[1,0,1,0]]",
    colorCounts: [
      { id: "red", count: 2 },
      { id: "blue", count: 2 },
    ],
    longestCircularFloatByRow: [1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  KnittingColorworkRepeatInput,
  KnittingColorworkRepeatOutput
>;
export const knittingColorworkRepeatTool = createModelDefinition<
  KnittingColorworkRepeatInput,
  KnittingColorworkRepeatOutput
>({
  id: "random/knitting-colorwork-repeat",
  title: "Random Knitting Colorwork Repeat Chart Generator",
  description:
    "Generate two-color cyclic stitch repeats with both colors present and verified wraparound float limits; chart rows do not infer garment construction or fit.",
  inputSchema,
  outputSchema,
  execute: calculateKnittingColorworkRepeat,
});
export const runKnittingColorworkRepeat = knittingColorworkRepeatTool.execute;
export default knittingColorworkRepeatTool;
