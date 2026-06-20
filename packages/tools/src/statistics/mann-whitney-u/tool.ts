import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  datasetNumberType,
  numberFiniteType,
} from "../../core/semantic-type.js";
import {
  averageRanks,
  finiteDataset,
  isRecord,
  roundStatistic,
} from "../input.js";

export type MannWhitneyUInput = {
  readonly first: readonly number[] | number | string;
  readonly second: readonly number[] | number | string;
};
export type MannWhitneyUOutput = {
  readonly firstU: number;
  readonly secondU: number;
  readonly statistic: number;
};
export const calculateMannWhitneyU = (
  input: unknown,
): ToolResult<MannWhitneyUOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const first = finiteDataset(input.first);
  const second = finiteDataset(input.second);
  if (!first?.length || !second?.length)
    return invalidInput([
      {
        code: "two_samples_required",
        field: "first",
        message: "Both samples must contain finite numbers.",
      },
    ]);
  const combined = [...first, ...second];
  const ranks = averageRanks(combined);
  const firstRankSum = ranks
    .slice(0, first.length)
    .reduce((sum, rank) => sum + rank, 0);
  const firstU = firstRankSum - (first.length * (first.length + 1)) / 2;
  const secondU = first.length * second.length - firstU;
  return toolSuccess({
    firstU: roundStatistic(firstU),
    secondU: roundStatistic(secondU),
    statistic: roundStatistic(Math.min(firstU, secondU)),
  });
};
export const mannWhitneyUTool = defineTool<
  MannWhitneyUInput,
  MannWhitneyUOutput
>({
  contractVersion: 1,
  description:
    "Calculate the Mann-Whitney U statistic for two independent samples using average ranks for ties.",
  execute: calculateMannWhitneyU,
  executionKind: "pure",
  id: "statistics/mann-whitney-u",
  inputSchema: { type: "object" },
  isOutput: (value): value is MannWhitneyUOutput =>
    isRecord(value) &&
    typeof value.statistic === "number" &&
    Number.isFinite(value.statistic),
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "first",
        label: "First sample",
        required: true,
        type: datasetNumberType,
      },
      {
        id: "second",
        label: "Second sample",
        required: true,
        type: datasetNumberType,
      },
    ],
    outputs: [
      {
        id: "statistic",
        label: "U statistic",
        path: ["statistic"],
        type: numberFiniteType,
        valueType: { format: "mann-whitney-u-statistic", type: "number" },
      },
    ],
  },
  title: "Mann-Whitney U Test Calculator",
});
export default mannWhitneyUTool;
