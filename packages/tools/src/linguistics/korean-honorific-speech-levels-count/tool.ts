import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedKoreanSpeechLevelCountKeys: readonly string[];
  readonly callerVerifiedKoreanSpeechLevelCountValues: readonly number[];
  readonly queryKoreanSpeechLevelCountKey: string;
  readonly observedKoreanSpeechLevelCountValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedKoreanSpeechLevelCountKeys",
    label: "Caller verified korean speech level count keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedKoreanSpeechLevelCountValues",
    label: "Caller verified korean speech level count values",
    kind: "numberList",
  },
  {
    id: "queryKoreanSpeechLevelCountKey",
    label: "Query korean speech level count key",
    kind: "string",
  },
  {
    id: "observedKoreanSpeechLevelCountValue",
    label: "Observed korean speech level count value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedKoreanSpeechLevelCountValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedKoreanSpeechLevelCountValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedKoreanSpeechLevelCountKeys,
    input.callerVerifiedKoreanSpeechLevelCountValues,
    "callerVerifiedKoreanSpeechLevelCountKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedKoreanSpeechLevelCountKeys,
    input.queryKoreanSpeechLevelCountKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedKoreanSpeechLevelCountValues[i],
    signedObservedMinusReference:
      input.observedKoreanSpeechLevelCountValue -
      input.callerVerifiedKoreanSpeechLevelCountValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedKoreanSpeechLevelCountKeys: ["a", "b"],
  callerVerifiedKoreanSpeechLevelCountValues: [2, 4],
  queryKoreanSpeechLevelCountKey: "b",
  observedKoreanSpeechLevelCountValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/korean-honorific-speech-levels-count",
  title: "Korean Honorific Speech Levels Count",
  description:
    "Count independently specified Korean register-level inventory under caller classification tradition, six/seven distinctions not collapsed into a universal count. Exact independently matched reference; signed deviations retained. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceValue",
      label: "Caller reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedKoreanSpeechLevelCountKeys:
        value.callerVerifiedKoreanSpeechLevelCountKeys as readonly string[],
      callerVerifiedKoreanSpeechLevelCountValues:
        value.callerVerifiedKoreanSpeechLevelCountValues as readonly number[],
      queryKoreanSpeechLevelCountKey:
        value.queryKoreanSpeechLevelCountKey as string,
      observedKoreanSpeechLevelCountValue:
        value.observedKoreanSpeechLevelCountValue as number,
    }),
});
export const run = tool.execute;
export default tool;
