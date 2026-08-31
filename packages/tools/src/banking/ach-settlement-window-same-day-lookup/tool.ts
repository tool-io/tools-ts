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
  clockMinute,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly submissionClock: string;
  readonly callerSameDayCutoffClocks: readonly string[];
  readonly callerCorrespondingSettlementClocks: readonly string[];
}>;
export type Output = Readonly<{
  readonly selectedCallerWindowIndex: number;
  readonly selectedCallerSettlementClock: string;
  readonly callerSameDayWindowAvailable: boolean;
}>;
const inputFields = [
  { id: "submissionClock", label: "Submission clock", kind: "string" },
  {
    id: "callerSameDayCutoffClocks",
    label: "Caller same day cutoff clocks",
    kind: "stringList",
  },
  {
    id: "callerCorrespondingSettlementClocks",
    label: "Caller corresponding settlement clocks",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSameDayCutoffClocks,
    input.callerCorrespondingSettlementClocks,
    "callerSameDayCutoffClocks",
  );
  const cutoffs = input.callerSameDayCutoffClocks.map(clockMinute),
    settlements = input.callerCorrespondingSettlementClocks.map(clockMinute),
    submit = clockMinute(input.submissionClock);
  if (
    cutoffs.some((v, i) => i > 0 && v <= cutoffs[i - 1]) ||
    settlements.some(
      (v, i) => v < cutoffs[i] || (i > 0 && v <= settlements[i - 1]),
    )
  )
    simpleError(
      "windows",
      "Increasing caller cutoff/settlement clocks with settlement no earlier than cutoff required.",
    );
  const index = cutoffs.findIndex((c) => submit <= c);
  return {
    selectedCallerWindowIndex: index,
    selectedCallerSettlementClock:
      index < 0 ? "" : input.callerCorrespondingSettlementClocks[index],
    callerSameDayWindowAvailable: index >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  submissionClock: "11:00",
  callerSameDayCutoffClocks: ["10:00", "14:00"],
  callerCorrespondingSettlementClocks: ["13:00", "17:00"],
} satisfies Input;
export const exampleOutput = {
  selectedCallerWindowIndex: 1,
  selectedCallerSettlementClock: "17:00",
  callerSameDayWindowAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/ach-settlement-window-same-day-lookup",
  title: "ACH Settlement Window Same Day Lookup",
  description:
    "Select earliest still-open caller ACH same-day submission window and paired settlement clock, inclusive at cutoff; caller has already verified processing date/network eligibility/time zone, no hardcoded NACHA clock or settlement assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "selectedCallerWindowIndex",
      label: "Selected caller window index",
      kind: "number",
    },
    {
      id: "selectedCallerSettlementClock",
      label: "Selected caller settlement clock",
      kind: "string",
    },
    {
      id: "callerSameDayWindowAvailable",
      label: "Caller same day window available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      submissionClock: value.submissionClock as string,
      callerSameDayCutoffClocks:
        value.callerSameDayCutoffClocks as readonly string[],
      callerCorrespondingSettlementClocks:
        value.callerCorrespondingSettlementClocks as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
