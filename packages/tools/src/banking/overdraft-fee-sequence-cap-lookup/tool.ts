import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  bounded,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedEventDayIndices: readonly number[];
  readonly callerFeeEligibleFlags: readonly number[];
  readonly callerFeePerEventMinor: number;
  readonly callerDailyFeeCountCap: number;
}>;
export type Output = Readonly<{
  readonly appliedEventFeesMinor: readonly number[];
  readonly totalObservedFeesMinor: number;
  readonly cappedEligibleEventIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedEventDayIndices",
    label: "Observed event day indices",
    kind: "numberList",
  },
  {
    id: "callerFeeEligibleFlags",
    label: "Caller fee eligible flags",
    kind: "numberList",
  },
  {
    id: "callerFeePerEventMinor",
    label: "Caller fee per event minor",
    kind: "number",
  },
  {
    id: "callerDailyFeeCountCap",
    label: "Caller daily fee count cap",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerFeePerEventMinor, "callerFeePerEventMinor");
  input.observedEventDayIndices.forEach((v) =>
    integer(v, "observedEventDayIndices"),
  );
  binary(input.callerFeeEligibleFlags, "callerFeeEligibleFlags");
  aligned(
    input.observedEventDayIndices,
    input.callerFeeEligibleFlags,
    "observedEventDayIndices",
  );
  bounded(input.callerDailyFeeCountCap, "cap", 0, 1000);
  if (
    input.observedEventDayIndices.some(
      (v, i) => v < 0 || (i > 0 && v < input.observedEventDayIndices[i - 1]),
    )
  )
    simpleError(
      "events",
      "Nondecreasing explicit day-index event ledger required.",
    );
  const counts = new Map<number, number>(),
    capped: number[] = [];
  const fees = input.observedEventDayIndices.map((d, i) => {
    if (!input.callerFeeEligibleFlags[i]) return 0;
    const n = counts.get(d) ?? 0;
    if (n >= input.callerDailyFeeCountCap) {
      capped.push(i);
      return 0;
    }
    counts.set(d, n + 1);
    return input.callerFeePerEventMinor;
  });
  return {
    appliedEventFeesMinor: fees,
    totalObservedFeesMinor: sumMoney(fees),
    cappedEligibleEventIndices: capped,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEventDayIndices: [0, 0, 0, 1],
  callerFeeEligibleFlags: [1, 1, 1, 1],
  callerFeePerEventMinor: 10,
  callerDailyFeeCountCap: 2,
} satisfies Input;
export const exampleOutput = {
  appliedEventFeesMinor: [10, 10, 0, 10],
  totalObservedFeesMinor: 30,
  cappedEligibleEventIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/overdraft-fee-sequence-cap-lookup",
  title: "Overdraft Fee Sequence Cap Lookup",
  description:
    "Replay caller already classified fee-eligible overdraft events in ledger order under explicit daily fee-count cap; eligibility/opt-in, NSF distinction and legal fee permission remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "appliedEventFeesMinor",
      label: "Applied event fees minor",
      kind: "numberList",
    },
    {
      id: "totalObservedFeesMinor",
      label: "Total observed fees minor",
      kind: "number",
    },
    {
      id: "cappedEligibleEventIndices",
      label: "Capped eligible event indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEventDayIndices:
        value.observedEventDayIndices as readonly number[],
      callerFeeEligibleFlags: value.callerFeeEligibleFlags as readonly number[],
      callerFeePerEventMinor: value.callerFeePerEventMinor as number,
      callerDailyFeeCountCap: value.callerDailyFeeCountCap as number,
    }),
});
export const run = tool.execute;
export default tool;
