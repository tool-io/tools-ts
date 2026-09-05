import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerBavarianVolumeIds: readonly string[];
  readonly callerBavarianVolumeValues: readonly number[];
  readonly queryBavarianVolumeId: string;
  readonly observedBavarianVolumeValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedBavarianVolumeValue: number;
  readonly signedObservedMinusBavarianVolumeReference: number;
}>;
const inputFields = [
  {
    id: "callerBavarianVolumeIds",
    label: "Caller bavarian volume ids",
    kind: "stringList",
  },
  {
    id: "callerBavarianVolumeValues",
    label: "Caller bavarian volume values",
    kind: "numberList",
  },
  {
    id: "queryBavarianVolumeId",
    label: "Query bavarian volume id",
    kind: "string",
  },
  {
    id: "observedBavarianVolumeValue",
    label: "Observed bavarian volume value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerBavarianVolumeIds,
    input.callerBavarianVolumeValues,
    "callerBavarianVolumeIds",
  );
  input.callerBavarianVolumeValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedBavarianVolumeValue, "observation");
  const i = catalogIndex(
    input.callerBavarianVolumeIds,
    input.queryBavarianVolumeId,
  );
  return {
    callerMatchedBavarianVolumeValue: input.callerBavarianVolumeValues[i],
    signedObservedMinusBavarianVolumeReference:
      input.observedBavarianVolumeValue - input.callerBavarianVolumeValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBavarianVolumeIds: ["a", "b"],
  callerBavarianVolumeValues: [2, 4],
  queryBavarianVolumeId: "b",
  observedBavarianVolumeValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedBavarianVolumeValue: 4,
  signedObservedMinusBavarianVolumeReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/volume-table-bavarian",
  title: "Bavarian Volume Table Lookup",
  description:
    "Audit caller verified Bavarian species/size volume reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedBavarianVolumeValue",
      label: "Caller matched bavarian volume value",
      kind: "number",
    },
    {
      id: "signedObservedMinusBavarianVolumeReference",
      label: "Signed observed minus bavarian volume reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBavarianVolumeIds:
        value.callerBavarianVolumeIds as readonly string[],
      callerBavarianVolumeValues:
        value.callerBavarianVolumeValues as readonly number[],
      queryBavarianVolumeId: value.queryBavarianVolumeId as string,
      observedBavarianVolumeValue: value.observedBavarianVolumeValue as number,
    }),
});
export const run = tool.execute;
export default tool;
