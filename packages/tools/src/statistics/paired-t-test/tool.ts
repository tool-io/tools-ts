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
  finiteDataset,
  isRecord,
  mean,
  roundStatistic,
  sampleVariance,
} from "../input.js";

export type PairedTTestInput = {
  readonly first: readonly number[] | number | string;
  readonly second: readonly number[] | number | string;
};
export type PairedTTestOutput = {
  readonly degreesOfFreedom: number;
  readonly meanDifference: number;
  readonly sampleSize: number;
  readonly standardDeviation: number;
  readonly standardError: number;
  readonly tStatistic: number;
};
export const calculatePairedTTest = (
  input: unknown,
): ToolResult<PairedTTestOutput> => {
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
  const differences = first.map((value, index) => value - second[index]!);
  const meanDifference = mean(differences);
  const standardDeviation = Math.sqrt(sampleVariance(differences));
  const standardError = standardDeviation / Math.sqrt(differences.length);
  const tStatistic =
    standardError === 0
      ? meanDifference === 0
        ? 0
        : Number.NaN
      : meanDifference / standardError;
  if (!Number.isFinite(tStatistic))
    return invalidInput([
      {
        code: "undefined_statistic",
        field: "first",
        message: "The paired statistic is undefined for these differences.",
      },
    ]);
  return toolSuccess({
    degreesOfFreedom: differences.length - 1,
    meanDifference: roundStatistic(meanDifference),
    sampleSize: differences.length,
    standardDeviation: roundStatistic(standardDeviation),
    standardError: roundStatistic(standardError),
    tStatistic: roundStatistic(tStatistic),
  });
};
export const pairedTTestTool = defineTool<PairedTTestInput, PairedTTestOutput>({
  contractVersion: 1,
  description:
    "Calculate the paired-samples t statistic for matched observations.",
  execute: calculatePairedTTest,
  executionKind: "pure",
  id: "statistics/paired-t-test",
  inputSchema: { type: "object" },
  isOutput: (value): value is PairedTTestOutput =>
    isRecord(value) &&
    typeof value.tStatistic === "number" &&
    Number.isFinite(value.tStatistic),
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
        id: "tStatistic",
        label: "T statistic",
        path: ["tStatistic"],
        type: numberFiniteType,
        valueType: { format: "t-statistic", type: "number" },
      },
    ],
  },
  title: "Paired T-Test Calculator",
});
export default pairedTTestTool;
