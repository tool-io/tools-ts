import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  datasetNumberType,
  numberFiniteType,
  textPlainType,
} from "../../core/semantic-type.js";
import { finiteDataset, isRecord, mean, roundStatistic } from "../input.js";

export type JackknifeStatistic = "mean" | "median";

export type JackknifeBiasInput = {
  readonly statistic?: JackknifeStatistic;
  readonly values: readonly number[] | number | string;
};

export type JackknifeBiasOutput = {
  readonly bias: number;
  readonly estimate: number;
  readonly jackknifeEstimate: number;
  readonly statistic: JackknifeStatistic;
};

const median = (values: readonly number[]): number => {
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0
    ? (ordered[middle - 1]! + ordered[middle]!) / 2
    : ordered[middle]!;
};

export const calculateJackknifeBias = (
  input: unknown,
): ToolResult<JackknifeBiasOutput> => {
  if (!isRecord(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }
  const values = finiteDataset(input.values);
  const statistic = input.statistic ?? "mean";
  if (
    !values ||
    values.length < 2 ||
    (statistic !== "mean" && statistic !== "median")
  ) {
    return invalidInput([
      {
        code: "valid_jackknife_input_required",
        field: "values",
        message:
          "Provide at least two finite values and a supported statistic.",
      },
    ]);
  }

  const summarize = statistic === "median" ? median : mean;
  const estimate = summarize(values);
  const leaveOneOut = values.map((_, omitted) =>
    summarize(values.filter((__, index) => index !== omitted)),
  );
  const jackknifeEstimate = mean(leaveOneOut);
  const bias = (values.length - 1) * (jackknifeEstimate - estimate);

  return toolSuccess({
    bias: roundStatistic(bias),
    estimate: roundStatistic(estimate),
    jackknifeEstimate: roundStatistic(jackknifeEstimate),
    statistic,
  });
};

export const jackknifeBiasTool = defineTool<
  JackknifeBiasInput,
  JackknifeBiasOutput
>({
  contractVersion: 1,
  description:
    "Estimate the bias of a sample mean or median with leave-one-out jackknife resampling.",
  execute: calculateJackknifeBias,
  executionKind: "pure",
  id: "statistics/jackknife-bias",
  inputSchema: { type: "object" },
  isOutput: (value): value is JackknifeBiasOutput =>
    isRecord(value) &&
    typeof value.bias === "number" &&
    Number.isFinite(value.bias),
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "values",
        label: "Sample",
        required: true,
        type: datasetNumberType,
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "statistic",
        label: "Statistic",
        required: false,
        type: textPlainType,
        valueType: { format: "statistic-name", type: "string" },
      },
    ],
    outputs: [
      {
        id: "bias",
        label: "Estimated bias",
        path: ["bias"],
        type: numberFiniteType,
        valueType: { format: "bias-estimate", type: "number" },
      },
    ],
  },
  title: "Jackknife Bias Calculator",
});

export default jackknifeBiasTool;
