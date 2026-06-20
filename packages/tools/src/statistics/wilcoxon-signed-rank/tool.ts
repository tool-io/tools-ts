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

export type WilcoxonSignedRankInput = {
  readonly first: readonly number[] | number | string;
  readonly second: readonly number[] | number | string;
};
export type WilcoxonSignedRankOutput = {
  readonly negativeRankSum: number;
  readonly nonzeroPairs: number;
  readonly positiveRankSum: number;
  readonly statistic: number;
};
export const calculateWilcoxonSignedRank = (
  input: unknown,
): ToolResult<WilcoxonSignedRankOutput> => {
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
  if (!first || !second || first.length !== second.length || first.length < 2)
    return invalidInput([
      {
        code: "matched_samples_required",
        field: "first",
        message: "Matched samples must have the same length of at least two.",
      },
    ]);
  const differences = first
    .map((value, index) => value - second[index]!)
    .filter((value) => value !== 0);
  if (differences.length === 0)
    return invalidInput([
      {
        code: "nonzero_difference_required",
        field: "first",
        message: "At least one pair must have a nonzero difference.",
      },
    ]);
  const ranks = averageRanks(differences.map(Math.abs));
  let positiveRankSum = 0;
  let negativeRankSum = 0;
  differences.forEach((difference, index) => {
    if (difference > 0) positiveRankSum += ranks[index]!;
    else negativeRankSum += ranks[index]!;
  });
  return toolSuccess({
    negativeRankSum: roundStatistic(negativeRankSum),
    nonzeroPairs: differences.length,
    positiveRankSum: roundStatistic(positiveRankSum),
    statistic: roundStatistic(Math.min(positiveRankSum, negativeRankSum)),
  });
};
export const wilcoxonSignedRankTool = defineTool<
  WilcoxonSignedRankInput,
  WilcoxonSignedRankOutput
>({
  contractVersion: 1,
  description:
    "Calculate the two-sided Wilcoxon signed-rank statistic with average ranks for ties and zero differences removed.",
  execute: calculateWilcoxonSignedRank,
  executionKind: "pure",
  id: "statistics/wilcoxon-signed-rank",
  inputSchema: { type: "object" },
  isOutput: (value): value is WilcoxonSignedRankOutput =>
    isRecord(value) &&
    typeof value.statistic === "number" &&
    Number.isFinite(value.statistic),
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "first",
        label: "First matched sample",
        required: true,
        type: datasetNumberType,
      },
      {
        id: "second",
        label: "Second matched sample",
        required: true,
        type: datasetNumberType,
      },
    ],
    outputs: [
      {
        id: "statistic",
        label: "W statistic",
        path: ["statistic"],
        type: numberFiniteType,
        valueType: { format: "wilcoxon-signed-rank-statistic", type: "number" },
      },
    ],
  },
  title: "Wilcoxon Signed-Rank Test Calculator",
});
export default wilcoxonSignedRankTool;
