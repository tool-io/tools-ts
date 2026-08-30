import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  mean,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly requestSubmittedMinutes: readonly number[];
  readonly requestCompletedMinutes: readonly number[];
  readonly completedRequestFlags: readonly number[];
  readonly asOfMinute: number;
}>;
export type Output = Readonly<{
  readonly completedRequestMeanWaitMinutes: number;
  readonly pendingRequestWaitLowerBoundsMinutes: readonly number[];
  readonly completedRequestCount: number;
  readonly pendingRequestCount: number;
}>;
const inputFields = [
  {
    id: "requestSubmittedMinutes",
    label: "Request submitted minutes",
    kind: "numberList",
  },
  {
    id: "requestCompletedMinutes",
    label: "Request completed minutes",
    kind: "numberList",
  },
  {
    id: "completedRequestFlags",
    label: "Completed request flags",
    kind: "numberList",
  },
  { id: "asOfMinute", label: "As of minute", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requestSubmittedMinutes.forEach((v) =>
    nonnegative(v, "requestSubmittedMinutes"),
  );
  input.requestCompletedMinutes.forEach((v) =>
    nonnegative(v, "requestCompletedMinutes"),
  );
  nonnegative(input.asOfMinute, "asOfMinute");
  aligned(
    input.requestSubmittedMinutes,
    input.requestCompletedMinutes,
    "requestSubmittedMinutes",
  );
  aligned(
    input.requestSubmittedMinutes,
    input.completedRequestFlags,
    "requestSubmittedMinutes",
  );
  binary(input.completedRequestFlags, "completed");
  if (
    input.requestSubmittedMinutes.some(
      (v, i) =>
        v > input.asOfMinute ||
        (input.completedRequestFlags[i] &&
          (input.requestCompletedMinutes[i] < v ||
            input.requestCompletedMinutes[i] > input.asOfMinute)),
    )
  )
    simpleError(
      "timeline",
      "Coherent observed request/as-of/completion times required.",
    );
  const done = input.requestSubmittedMinutes.flatMap((v, i) =>
      input.completedRequestFlags[i]
        ? [input.requestCompletedMinutes[i] - v]
        : [],
    ),
    pending = input.requestSubmittedMinutes.flatMap((v, i) =>
      !input.completedRequestFlags[i] ? [input.asOfMinute - v] : [],
    );
  return {
    completedRequestMeanWaitMinutes: mean(done),
    pendingRequestWaitLowerBoundsMinutes: pending,
    completedRequestCount: done.length,
    pendingRequestCount: pending.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestSubmittedMinutes: [0, 10, 20],
  requestCompletedMinutes: [5, 30, 0],
  completedRequestFlags: [1, 1, 0],
  asOfMinute: 40,
} satisfies Input;
export const exampleOutput = {
  completedRequestMeanWaitMinutes: 12.5,
  pendingRequestWaitLowerBoundsMinutes: [20],
  completedRequestCount: 2,
  pendingRequestCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/paging-wait-average-calculator",
  title: "Paging Request Queue Wait Time Average Calculator",
  description:
    "Report actual completed request wait mean separately from pending right-censored lower bounds; no treating missing completion as zero or survival-adjusted service level.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedRequestMeanWaitMinutes",
      label: "Completed request mean wait minutes",
      kind: "number",
    },
    {
      id: "pendingRequestWaitLowerBoundsMinutes",
      label: "Pending request wait lower bounds minutes",
      kind: "numberList",
    },
    {
      id: "completedRequestCount",
      label: "Completed request count",
      kind: "number",
    },
    {
      id: "pendingRequestCount",
      label: "Pending request count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requestSubmittedMinutes:
        value.requestSubmittedMinutes as readonly number[],
      requestCompletedMinutes:
        value.requestCompletedMinutes as readonly number[],
      completedRequestFlags: value.completedRequestFlags as readonly number[],
      asOfMinute: value.asOfMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
