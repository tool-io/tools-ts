import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStrainWristPostureKeys: readonly string[];
  readonly callerVerifiedStrainWristPostureValues: readonly number[];
  readonly queryStrainWristPostureKey: string;
  readonly observedStrainWristPostureValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedStrainWristPostureKeys",
    label: "Caller verified strain wrist posture keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedStrainWristPostureValues",
    label: "Caller verified strain wrist posture values",
    kind: "numberList",
  },
  {
    id: "queryStrainWristPostureKey",
    label: "Query strain wrist posture key",
    kind: "string",
  },
  {
    id: "observedStrainWristPostureValue",
    label: "Observed strain wrist posture value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedStrainWristPostureKeys,
    input.callerVerifiedStrainWristPostureValues,
    "callerVerifiedStrainWristPostureKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedStrainWristPostureKeys,
    input.queryStrainWristPostureKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedStrainWristPostureValues[i],
    signedObservedMinusReference:
      input.observedStrainWristPostureValue -
      input.callerVerifiedStrainWristPostureValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedStrainWristPostureKeys: ["a", "b"],
  callerVerifiedStrainWristPostureValues: [2, 4],
  queryStrainWristPostureKey: "b",
  observedStrainWristPostureValue: 5,
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
  id: "ergonomics/strain-index-wrist-posture",
  title: "Strain Index Wrist Posture Score Calculator",
  description:
    "StrainIndex wrist-posture observed category and caller same-edition multiplier table, no universal mapping from one flexion angle alone. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedStrainWristPostureKeys:
        value.callerVerifiedStrainWristPostureKeys as readonly string[],
      callerVerifiedStrainWristPostureValues:
        value.callerVerifiedStrainWristPostureValues as readonly number[],
      queryStrainWristPostureKey: value.queryStrainWristPostureKey as string,
      observedStrainWristPostureValue:
        value.observedStrainWristPostureValue as number,
    }),
});
export const run = tool.execute;
export default tool;
