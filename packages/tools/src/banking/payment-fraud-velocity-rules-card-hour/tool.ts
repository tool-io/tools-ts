import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  nonnegative,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedCardIds: readonly string[];
  readonly transactionMinutes: readonly number[];
  readonly asOfMinute: number;
  readonly callerLookbackMinutes: number;
  readonly callerInclusiveCountThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedWindowCardIds: readonly string[];
  readonly observedWindowTransactionCounts: readonly number[];
  readonly thresholdFlaggedCardIds: readonly string[];
  readonly countedWindowTransactionIndices: readonly number[];
}>;
const inputFields = [
  { id: "observedCardIds", label: "Observed card ids", kind: "stringList" },
  {
    id: "transactionMinutes",
    label: "Transaction minutes",
    kind: "numberList",
  },
  { id: "asOfMinute", label: "As of minute", kind: "number" },
  {
    id: "callerLookbackMinutes",
    label: "Caller lookback minutes",
    kind: "number",
  },
  {
    id: "callerInclusiveCountThreshold",
    label: "Caller inclusive count threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.transactionMinutes.forEach((v) => integer(v, "transactionMinutes"));
  integer(input.asOfMinute, "asOfMinute");
  aligned(input.observedCardIds, input.transactionMinutes, "observedCardIds");
  bounded(input.callerLookbackMinutes, "lookback", 1, 10080);
  bounded(input.callerInclusiveCountThreshold, "threshold", 1, 10000);
  if (
    input.transactionMinutes.some(
      (v, i) =>
        v < 0 ||
        v > input.asOfMinute ||
        (i > 0 && v < input.transactionMinutes[i - 1]),
    ) ||
    input.observedCardIds.some((s) => !s.trim())
  )
    simpleError(
      "events",
      "Nondecreasing nonfuture nonnegative times and explicit card labels required.",
    );
  const indices = input.transactionMinutes.flatMap((t, i) =>
      t > input.asOfMinute - input.callerLookbackMinutes &&
      t <= input.asOfMinute
        ? [i]
        : [],
    ),
    counts = new Map<string, number>();
  indices.forEach((i) =>
    counts.set(
      input.observedCardIds[i],
      (counts.get(input.observedCardIds[i]) ?? 0) + 1,
    ),
  );
  return {
    observedWindowCardIds: [...counts.keys()],
    observedWindowTransactionCounts: [...counts.values()],
    thresholdFlaggedCardIds: [...counts]
      .filter(([, n]) => n >= input.callerInclusiveCountThreshold)
      .map(([s]) => s),
    countedWindowTransactionIndices: indices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCardIds: ["A", "A", "B", "A"],
  transactionMinutes: [0, 30, 35, 60],
  asOfMinute: 60,
  callerLookbackMinutes: 60,
  callerInclusiveCountThreshold: 2,
} satisfies Input;
export const exampleOutput = {
  observedWindowCardIds: ["A", "B"],
  observedWindowTransactionCounts: [2, 1],
  thresholdFlaggedCardIds: ["A"],
  countedWindowTransactionIndices: [1, 2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/payment-fraud-velocity-rules-card-hour",
  title: "Payment Fraud Velocity Rules Card Hour Tool",
  description:
    "Audit actual observed per-card transaction velocity in explicit (as-of−lookback, as-of] window under caller inclusive count threshold; labels are pseudonymous caller IDs, threshold flags are review candidates rather than proof of fraud or permission to block.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWindowCardIds",
      label: "Observed window card ids",
      kind: "stringList",
    },
    {
      id: "observedWindowTransactionCounts",
      label: "Observed window transaction counts",
      kind: "numberList",
    },
    {
      id: "thresholdFlaggedCardIds",
      label: "Threshold flagged card ids",
      kind: "stringList",
    },
    {
      id: "countedWindowTransactionIndices",
      label: "Counted window transaction indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCardIds: value.observedCardIds as readonly string[],
      transactionMinutes: value.transactionMinutes as readonly number[],
      asOfMinute: value.asOfMinute as number,
      callerLookbackMinutes: value.callerLookbackMinutes as number,
      callerInclusiveCountThreshold:
        value.callerInclusiveCountThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
