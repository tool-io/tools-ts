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
  readonly callerVerifiedNioshCouplingKeys: readonly string[];
  readonly callerVerifiedNioshCouplingValues: readonly number[];
  readonly queryNioshCouplingKey: string;
  readonly observedNioshCouplingValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedNioshCouplingKeys",
    label: "Caller verified niosh coupling keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNioshCouplingValues",
    label: "Caller verified niosh coupling values",
    kind: "numberList",
  },
  {
    id: "queryNioshCouplingKey",
    label: "Query niosh coupling key",
    kind: "string",
  },
  {
    id: "observedNioshCouplingValue",
    label: "Observed niosh coupling value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedNioshCouplingValues.forEach((v) =>
    fraction(v, "caller physical fraction"),
  );
  fraction(input.observedNioshCouplingValue, "observed fraction");
  aligned(
    input.callerVerifiedNioshCouplingKeys,
    input.callerVerifiedNioshCouplingValues,
    "callerVerifiedNioshCouplingKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedNioshCouplingKeys,
    input.queryNioshCouplingKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedNioshCouplingValues[i],
    signedObservedMinusReference:
      input.observedNioshCouplingValue -
      input.callerVerifiedNioshCouplingValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNioshCouplingKeys: ["a", "b"],
  callerVerifiedNioshCouplingValues: [0.2, 0.4],
  queryNioshCouplingKey: "b",
  observedNioshCouplingValue: 0.5,
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
  id: "ergonomics/niosh-coupling-multiplier",
  title: "NIOSH Coupling Multiplier Lookup",
  description:
    "RNLE coupling multiplier exact independently verified good/fair/poor coupling and vertical-region table key, task context part of reference. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedNioshCouplingKeys:
        value.callerVerifiedNioshCouplingKeys as readonly string[],
      callerVerifiedNioshCouplingValues:
        value.callerVerifiedNioshCouplingValues as readonly number[],
      queryNioshCouplingKey: value.queryNioshCouplingKey as string,
      observedNioshCouplingValue: value.observedNioshCouplingValue as number,
    }),
});
export const run = tool.execute;
export default tool;
