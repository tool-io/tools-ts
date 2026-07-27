import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  averageRanks,
  finiteDataset,
  isRecord,
  numericDatasetSchema,
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

export const mannWhitneyUExample = {
  input: { first: [1, 2], second: [3, 4] },
} satisfies ToolExample<MannWhitneyUInput>;

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
  execution: { kind: "pure" },
  id: "statistics/mann-whitney-u",
  inputSchema: {
    additionalProperties: false,
    properties: { first: numericDatasetSchema, second: numericDatasetSchema },
    required: ["first", "second"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      firstU: { minimum: 0, type: "number" },
      secondU: { minimum: 0, type: "number" },
      statistic: { minimum: 0, type: "number" },
    },
    required: ["firstU", "secondU", "statistic"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "first",
        label: "First sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "second",
        label: "Second sample",
        required: true,
        valueType: { items: { type: "number" }, type: "list" },
      },
    ],
    outputs: [
      {
        id: "statistic",
        label: "U statistic",
        path: ["statistic"],
        valueType: { format: "mann-whitney-u-statistic", type: "number" },
      },
    ],
  },
  title: "Mann-Whitney U Test Calculator",
});
export default mannWhitneyUTool;
