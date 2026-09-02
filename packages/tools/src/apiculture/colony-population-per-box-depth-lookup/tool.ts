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
  readonly callerVerifiedBoxObservedAdultPopulationKeys: readonly string[];
  readonly callerVerifiedBoxObservedAdultPopulationValues: readonly number[];
  readonly queryBoxObservedAdultPopulationKey: string;
  readonly observedBoxObservedAdultPopulationValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedBoxObservedAdultPopulationKeys",
    label: "Caller verified box observed adult population keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBoxObservedAdultPopulationValues",
    label: "Caller verified box observed adult population values",
    kind: "numberList",
  },
  {
    id: "queryBoxObservedAdultPopulationKey",
    label: "Query box observed adult population key",
    kind: "string",
  },
  {
    id: "observedBoxObservedAdultPopulationValue",
    label: "Observed box observed adult population value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedBoxObservedAdultPopulationValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedBoxObservedAdultPopulationValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedBoxObservedAdultPopulationKeys,
    input.callerVerifiedBoxObservedAdultPopulationValues,
    "callerVerifiedBoxObservedAdultPopulationKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedBoxObservedAdultPopulationKeys,
    input.queryBoxObservedAdultPopulationKey,
  );
  return {
    callerReferenceValue:
      input.callerVerifiedBoxObservedAdultPopulationValues[i],
    signedObservedMinusReference:
      input.observedBoxObservedAdultPopulationValue -
      input.callerVerifiedBoxObservedAdultPopulationValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBoxObservedAdultPopulationKeys: ["a", "b"],
  callerVerifiedBoxObservedAdultPopulationValues: [2, 4],
  queryBoxObservedAdultPopulationKey: "b",
  observedBoxObservedAdultPopulationValue: 5,
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
  id: "apiculture/colony-population-per-box-depth-lookup",
  title: "Colony Population Per Box Depth Lookup",
  description:
    "Caller independently verified box model/occupied-fraction/season adult-population observation reference, not full-box capacity or colony adequacy. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedBoxObservedAdultPopulationKeys:
        value.callerVerifiedBoxObservedAdultPopulationKeys as readonly string[],
      callerVerifiedBoxObservedAdultPopulationValues:
        value.callerVerifiedBoxObservedAdultPopulationValues as readonly number[],
      queryBoxObservedAdultPopulationKey:
        value.queryBoxObservedAdultPopulationKey as string,
      observedBoxObservedAdultPopulationValue:
        value.observedBoxObservedAdultPopulationValue as number,
    }),
});
export const run = tool.execute;
export default tool;
