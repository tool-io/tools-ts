import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  sum,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly capturedItemsPerBatch: readonly number[];
  readonly rejectedItemsPerBatch: readonly number[];
  readonly productiveBatchDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly acceptedItemsPerProductiveDayByBatch: readonly number[];
  readonly pooledAcceptedItemsPerProductiveDay: number;
  readonly pooledCaptureRejectionFraction: number;
}>;
const inputFields = [
  {
    id: "capturedItemsPerBatch",
    label: "Captured items per batch",
    kind: "numberList",
  },
  {
    id: "rejectedItemsPerBatch",
    label: "Rejected items per batch",
    kind: "numberList",
  },
  {
    id: "productiveBatchDays",
    label: "Productive batch days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.productiveBatchDays.forEach((v) => positive(v, "productiveBatchDays"));
  input.capturedItemsPerBatch.forEach((v) => count(v, "capturedItemsPerBatch"));
  input.rejectedItemsPerBatch.forEach((v) => count(v, "rejectedItemsPerBatch"));
  aligned(
    input.capturedItemsPerBatch,
    input.rejectedItemsPerBatch,
    "capturedItemsPerBatch",
  );
  aligned(
    input.capturedItemsPerBatch,
    input.productiveBatchDays,
    "capturedItemsPerBatch",
  );
  if (
    input.rejectedItemsPerBatch.some(
      (v, i) => v > input.capturedItemsPerBatch[i],
    )
  )
    simpleError(
      "rejected",
      "Rejected items must be a subset of capture inventory.",
    );
  const total = positive(
      totalCount(input.capturedItemsPerBatch, "captured"),
      "captured",
    ),
    rej = totalCount(input.rejectedItemsPerBatch, "rejected");
  return {
    acceptedItemsPerProductiveDayByBatch: input.capturedItemsPerBatch.map(
      (v, i) =>
        (v - input.rejectedItemsPerBatch[i]) / input.productiveBatchDays[i],
    ),
    pooledAcceptedItemsPerProductiveDay:
      (total - rej) / sum(input.productiveBatchDays),
    pooledCaptureRejectionFraction: rej / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  capturedItemsPerBatch: [100, 200],
  rejectedItemsPerBatch: [10, 20],
  productiveBatchDays: [1, 3],
} satisfies Input;
export const exampleOutput = {
  acceptedItemsPerProductiveDayByBatch: [90, 60],
  pooledAcceptedItemsPerProductiveDay: 67.5,
  pooledCaptureRejectionFraction: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/digitisation-throughput-per-day",
  title: "Digitisation Batch Throughput Items per Day Calculator",
  description:
    "Track QC-accepted digitization throughput separately from capture count across actual productive-day exposure; no implied metadata completion or full preservation workflow completion.",
  inputs: inputFields,
  outputs: [
    {
      id: "acceptedItemsPerProductiveDayByBatch",
      label: "Accepted items per productive day by batch",
      kind: "numberList",
    },
    {
      id: "pooledAcceptedItemsPerProductiveDay",
      label: "Pooled accepted items per productive day",
      kind: "number",
    },
    {
      id: "pooledCaptureRejectionFraction",
      label: "Pooled capture rejection fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      capturedItemsPerBatch: value.capturedItemsPerBatch as readonly number[],
      rejectedItemsPerBatch: value.rejectedItemsPerBatch as readonly number[],
      productiveBatchDays: value.productiveBatchDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
