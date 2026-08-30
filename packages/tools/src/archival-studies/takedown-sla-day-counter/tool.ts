import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned, binary } from "../shared.js";
export type Input = Readonly<{
  readonly requestReceivedOrdinals: readonly number[];
  readonly responseCompletedOrdinals: readonly number[];
  readonly completedResponseFlags: readonly number[];
  readonly callerResponseSlaDays: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly observedResponseElapsedDays: readonly number[];
  readonly signedSlaRemainingDays: readonly number[];
  readonly overSlaFlags: readonly number[];
  readonly pendingResponseCount: number;
}>;
const inputFields = [
  {
    id: "requestReceivedOrdinals",
    label: "Request received ordinals",
    kind: "numberList",
  },
  {
    id: "responseCompletedOrdinals",
    label: "Response completed ordinals",
    kind: "numberList",
  },
  {
    id: "completedResponseFlags",
    label: "Completed response flags",
    kind: "numberList",
  },
  {
    id: "callerResponseSlaDays",
    label: "Caller response sla days",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requestReceivedOrdinals.forEach((v) =>
    count(v, "requestReceivedOrdinals"),
  );
  input.responseCompletedOrdinals.forEach((v) =>
    count(v, "responseCompletedOrdinals"),
  );
  input.callerResponseSlaDays.forEach((v) => count(v, "callerResponseSlaDays"));
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.requestReceivedOrdinals,
    input.responseCompletedOrdinals,
    "requestReceivedOrdinals",
  );
  aligned(
    input.requestReceivedOrdinals,
    input.completedResponseFlags,
    "requestReceivedOrdinals",
  );
  aligned(
    input.requestReceivedOrdinals,
    input.callerResponseSlaDays,
    "requestReceivedOrdinals",
  );
  binary(input.completedResponseFlags, "completed");
  if (
    input.requestReceivedOrdinals.some(
      (v, i) =>
        v > input.asOfDayOrdinal ||
        (input.completedResponseFlags[i] &&
          (input.responseCompletedOrdinals[i] < v ||
            input.responseCompletedOrdinals[i] > input.asOfDayOrdinal)),
    )
  )
    simpleError("timeline", "Coherent request/as-of/response times required.");
  const elapsed = input.requestReceivedOrdinals.map(
    (v, i) =>
      (input.completedResponseFlags[i]
        ? input.responseCompletedOrdinals[i]
        : input.asOfDayOrdinal) - v,
  );
  return {
    observedResponseElapsedDays: elapsed,
    signedSlaRemainingDays: elapsed.map(
      (v, i) => input.callerResponseSlaDays[i] - v,
    ),
    overSlaFlags: elapsed.map((v, i) =>
      v > input.callerResponseSlaDays[i] ? 1 : 0,
    ),
    pendingResponseCount: input.completedResponseFlags.filter((v) => v === 0)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestReceivedOrdinals: [10, 20],
  responseCompletedOrdinals: [15, 0],
  completedResponseFlags: [1, 0],
  callerResponseSlaDays: [4, 10],
  asOfDayOrdinal: 25,
} satisfies Input;
export const exampleOutput = {
  observedResponseElapsedDays: [5, 5],
  signedSlaRemainingDays: [-1, 5],
  overSlaFlags: [1, 0],
  pendingResponseCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/takedown-sla-day-counter",
  title: "Takedown Request Response SLA Day Counter",
  description:
    "Audit declared takedown response SLA using actual completion or censored pending age, retaining signed margin; no lawful takedown deadline or merits determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedResponseElapsedDays",
      label: "Observed response elapsed days",
      kind: "numberList",
    },
    {
      id: "signedSlaRemainingDays",
      label: "Signed sla remaining days",
      kind: "numberList",
    },
    { id: "overSlaFlags", label: "Over sla flags", kind: "numberList" },
    {
      id: "pendingResponseCount",
      label: "Pending response count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requestReceivedOrdinals:
        value.requestReceivedOrdinals as readonly number[],
      responseCompletedOrdinals:
        value.responseCompletedOrdinals as readonly number[],
      completedResponseFlags: value.completedResponseFlags as readonly number[],
      callerResponseSlaDays: value.callerResponseSlaDays as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
