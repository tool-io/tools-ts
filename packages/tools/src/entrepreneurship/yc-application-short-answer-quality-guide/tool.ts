import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  aligned,
  binary,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerShortAnswerIds: readonly string[];
  readonly observedCodePointCounts: readonly number[];
  readonly callerCodePointLimits: readonly number[];
  readonly independentlySpecificEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedAnswerLengthReserves: readonly number[];
  readonly callerAnswerReviewIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerShortAnswerIds",
    label: "Caller short answer ids",
    kind: "stringList",
  },
  {
    id: "observedCodePointCounts",
    label: "Observed code point counts",
    kind: "numberList",
  },
  {
    id: "callerCodePointLimits",
    label: "Caller code point limits",
    kind: "numberList",
  },
  {
    id: "independentlySpecificEvidenceFlags",
    label: "Independently specific evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCodePointCounts.forEach((v) =>
    nonnegative(v, "observedCodePointCounts"),
  );
  input.callerCodePointLimits.forEach((v) =>
    nonnegative(v, "callerCodePointLimits"),
  );
  binary(
    input.independentlySpecificEvidenceFlags,
    "independentlySpecificEvidenceFlags",
  );
  aligned(
    input.callerShortAnswerIds,
    input.observedCodePointCounts,
    "callerShortAnswerIds",
  );
  aligned(
    input.callerShortAnswerIds,
    input.callerCodePointLimits,
    "callerShortAnswerIds",
  );
  aligned(
    input.callerShortAnswerIds,
    input.independentlySpecificEvidenceFlags,
    "callerShortAnswerIds",
  );
  unique(input.callerShortAnswerIds, "answers");
  [...input.observedCodePointCounts, ...input.callerCodePointLimits].forEach(
    (v) => integer(v, "code points"),
  );
  const d = input.callerCodePointLimits.map(
    (v, i) => v - input.observedCodePointCounts[i],
  );
  return {
    signedAnswerLengthReserves: d,
    callerAnswerReviewIds: input.callerShortAnswerIds.filter(
      (_, i) => d[i] < 0 || !input.independentlySpecificEvidenceFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShortAnswerIds: ["a", "b"],
  observedCodePointCounts: [100, 200],
  callerCodePointLimits: [150, 150],
  independentlySpecificEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedAnswerLengthReserves: [50, -50],
  callerAnswerReviewIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/yc-application-short-answer-quality-guide",
  title: "YC Application Short Answer Quality Guide",
  description:
    "Caller actual application-answer code-point counts and independently annotated specificity against supplied platform limits, not admission prediction or automatic truthfulness/style score. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedAnswerLengthReserves",
      label: "Signed answer length reserves",
      kind: "numberList",
    },
    {
      id: "callerAnswerReviewIds",
      label: "Caller answer review ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShortAnswerIds: value.callerShortAnswerIds as readonly string[],
      observedCodePointCounts:
        value.observedCodePointCounts as readonly number[],
      callerCodePointLimits: value.callerCodePointLimits as readonly number[],
      independentlySpecificEvidenceFlags:
        value.independentlySpecificEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
