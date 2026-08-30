import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
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
  readonly successfulRetrievalCountsByShift: readonly number[];
  readonly unsuccessfulAttemptCountsByShift: readonly number[];
  readonly productiveRetrievalHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly successfulRetrievalsPerProductiveHourByShift: readonly number[];
  readonly pooledSuccessfulRetrievalsPerProductiveHour: number;
  readonly attemptSuccessFraction: number;
}>;
const inputFields = [
  {
    id: "successfulRetrievalCountsByShift",
    label: "Successful retrieval counts by shift",
    kind: "numberList",
  },
  {
    id: "unsuccessfulAttemptCountsByShift",
    label: "Unsuccessful attempt counts by shift",
    kind: "numberList",
  },
  {
    id: "productiveRetrievalHours",
    label: "Productive retrieval hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.productiveRetrievalHours.forEach((v) =>
    positive(v, "productiveRetrievalHours"),
  );
  input.successfulRetrievalCountsByShift.forEach((v) =>
    count(v, "successfulRetrievalCountsByShift"),
  );
  input.unsuccessfulAttemptCountsByShift.forEach((v) =>
    count(v, "unsuccessfulAttemptCountsByShift"),
  );
  aligned(
    input.successfulRetrievalCountsByShift,
    input.unsuccessfulAttemptCountsByShift,
    "successfulRetrievalCountsByShift",
  );
  aligned(
    input.successfulRetrievalCountsByShift,
    input.productiveRetrievalHours,
    "successfulRetrievalCountsByShift",
  );
  const n = totalCount(input.successfulRetrievalCountsByShift, "successful"),
    fail = totalCount(input.unsuccessfulAttemptCountsByShift, "unsuccessful"),
    attempts = positive(count(n + fail, "attempts"), "attempts");
  return {
    successfulRetrievalsPerProductiveHourByShift:
      input.successfulRetrievalCountsByShift.map(
        (v, i) => v / input.productiveRetrievalHours[i],
      ),
    pooledSuccessfulRetrievalsPerProductiveHour:
      n / sum(input.productiveRetrievalHours),
    attemptSuccessFraction: n / attempts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  successfulRetrievalCountsByShift: [10, 20],
  unsuccessfulAttemptCountsByShift: [2, 5],
  productiveRetrievalHours: [2, 5],
} satisfies Input;
export const exampleOutput = {
  successfulRetrievalsPerProductiveHourByShift: [5, 4],
  pooledSuccessfulRetrievalsPerProductiveHour: 4.285714285714286,
  attemptSuccessFraction: 0.8108108108108109,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/daily-retrieval-productivity-metric",
  title: "Daily Retrieval Rate Productivity Metric Calculator",
  description:
    "Separate successful retrieval productivity from failed attempts and actual productive shift hours; unlike QC digitization count, request success exposure is explicit and not a staffing recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "successfulRetrievalsPerProductiveHourByShift",
      label: "Successful retrievals per productive hour by shift",
      kind: "numberList",
    },
    {
      id: "pooledSuccessfulRetrievalsPerProductiveHour",
      label: "Pooled successful retrievals per productive hour",
      kind: "number",
    },
    {
      id: "attemptSuccessFraction",
      label: "Attempt success fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      successfulRetrievalCountsByShift:
        value.successfulRetrievalCountsByShift as readonly number[],
      unsuccessfulAttemptCountsByShift:
        value.unsuccessfulAttemptCountsByShift as readonly number[],
      productiveRetrievalHours:
        value.productiveRetrievalHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
