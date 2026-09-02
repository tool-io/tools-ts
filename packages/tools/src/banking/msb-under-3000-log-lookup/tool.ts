import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  safeText,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMsbTransactionMinor: readonly number[];
  readonly observedCallerAggregationIds: readonly string[];
  readonly callerRecordkeepingLowerInclusiveMinor: number;
  readonly callerRecordkeepingUpperExclusiveMinor: number;
}>;
export type Output = Readonly<{
  readonly aggregationIds: readonly string[];
  readonly aggregatedTransactionMinor: readonly number[];
  readonly callerRecordkeepingCandidateIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedMsbTransactionMinor",
    label: "Observed msb transaction minor",
    kind: "numberList",
  },
  {
    id: "observedCallerAggregationIds",
    label: "Observed caller aggregation ids",
    kind: "stringList",
  },
  {
    id: "callerRecordkeepingLowerInclusiveMinor",
    label: "Caller recordkeeping lower inclusive minor",
    kind: "number",
  },
  {
    id: "callerRecordkeepingUpperExclusiveMinor",
    label: "Caller recordkeeping upper exclusive minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMsbTransactionMinor,
    input.observedCallerAggregationIds,
    "ledger",
  );
  input.observedMsbTransactionMinor.forEach((v) => money(v));
  input.observedCallerAggregationIds.forEach((v) => safeText(v, "group"));
  money(input.callerRecordkeepingLowerInclusiveMinor);
  money(input.callerRecordkeepingUpperExclusiveMinor);
  if (
    input.callerRecordkeepingUpperExclusiveMinor <=
    input.callerRecordkeepingLowerInclusiveMinor
  )
    simpleError(
      "window",
      "Explicit nonempty half-open caller recordkeeping amount band.",
    );
  const ids = [...new Set(input.observedCallerAggregationIds)],
    total = ids.map((id) =>
      sumMoney(
        input.observedMsbTransactionMinor.filter(
          (_, i) => input.observedCallerAggregationIds[i] === id,
        ),
      ),
    );
  return {
    aggregationIds: ids,
    aggregatedTransactionMinor: total,
    callerRecordkeepingCandidateIds: ids.filter(
      (_, i) =>
        total[i] >= input.callerRecordkeepingLowerInclusiveMinor &&
        total[i] < input.callerRecordkeepingUpperExclusiveMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMsbTransactionMinor: [200, 400],
  observedCallerAggregationIds: ["a", "a"],
  callerRecordkeepingLowerInclusiveMinor: 300,
  callerRecordkeepingUpperExclusiveMinor: 1000,
} satisfies Input;
export const exampleOutput = {
  aggregationIds: ["a"],
  aggregatedTransactionMinor: [600],
  callerRecordkeepingCandidateIds: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/msb-under-3000-log-lookup",
  title: "MSB Under 3000 Log Rule Lookup",
  description:
    "Audit actual MSB ledger aggregation within explicit caller half-open recordkeeping amount band; title is not a universal under3000 exemption or advice to avoid records. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    { id: "aggregationIds", label: "Aggregation ids", kind: "stringList" },
    {
      id: "aggregatedTransactionMinor",
      label: "Aggregated transaction minor",
      kind: "numberList",
    },
    {
      id: "callerRecordkeepingCandidateIds",
      label: "Caller recordkeeping candidate ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMsbTransactionMinor:
        value.observedMsbTransactionMinor as readonly number[],
      observedCallerAggregationIds:
        value.observedCallerAggregationIds as readonly string[],
      callerRecordkeepingLowerInclusiveMinor:
        value.callerRecordkeepingLowerInclusiveMinor as number,
      callerRecordkeepingUpperExclusiveMinor:
        value.callerRecordkeepingUpperExclusiveMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
