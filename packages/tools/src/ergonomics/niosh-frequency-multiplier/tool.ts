import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNioshFrequencyKeys: readonly string[];
  readonly callerVerifiedNioshFrequencyValues: readonly number[];
  readonly queryNioshFrequencyKey: string;
  readonly observedNioshFrequencyValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedNioshFrequencyKeys",
    label: "Caller verified niosh frequency keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNioshFrequencyValues",
    label: "Caller verified niosh frequency values",
    kind: "numberList",
  },
  {
    id: "queryNioshFrequencyKey",
    label: "Query niosh frequency key",
    kind: "string",
  },
  {
    id: "observedNioshFrequencyValue",
    label: "Observed niosh frequency value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedNioshFrequencyValues.forEach((v) =>
    fraction(v, "caller physical fraction"),
  );
  fraction(input.observedNioshFrequencyValue, "observed fraction");
  aligned(
    input.callerVerifiedNioshFrequencyKeys,
    input.callerVerifiedNioshFrequencyValues,
    "callerVerifiedNioshFrequencyKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedNioshFrequencyKeys,
    input.queryNioshFrequencyKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedNioshFrequencyValues[i],
    signedObservedMinusReference:
      input.observedNioshFrequencyValue -
      input.callerVerifiedNioshFrequencyValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNioshFrequencyKeys: ["a", "b"],
  callerVerifiedNioshFrequencyValues: [0.2, 0.4],
  queryNioshFrequencyKey: "b",
  observedNioshFrequencyValue: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 0.4,
  signedObservedMinusReference: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-frequency-multiplier",
  title: "NIOSH Frequency Multiplier Lookup",
  description:
    "RNLE frequency multiplier caller exact lifting frequency/duration/vertical-region reference key, independently matching protocol table; no interpolation between unsupported cells. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedNioshFrequencyKeys:
        value.callerVerifiedNioshFrequencyKeys as readonly string[],
      callerVerifiedNioshFrequencyValues:
        value.callerVerifiedNioshFrequencyValues as readonly number[],
      queryNioshFrequencyKey: value.queryNioshFrequencyKey as string,
      observedNioshFrequencyValue: value.observedNioshFrequencyValue as number,
    }),
});
export const run = tool.execute;
export default tool;
