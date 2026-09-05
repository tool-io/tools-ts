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
  readonly callerStandVolumeIds: readonly string[];
  readonly callerStandVolumeValues: readonly number[];
  readonly queryStandVolumeId: string;
  readonly observedStandVolumeValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedStandVolumeValue: number;
  readonly signedObservedMinusStandVolumeReference: number;
}>;
const inputFields = [
  {
    id: "callerStandVolumeIds",
    label: "Caller stand volume ids",
    kind: "stringList",
  },
  {
    id: "callerStandVolumeValues",
    label: "Caller stand volume values",
    kind: "numberList",
  },
  { id: "queryStandVolumeId", label: "Query stand volume id", kind: "string" },
  {
    id: "observedStandVolumeValue",
    label: "Observed stand volume value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerStandVolumeIds,
    input.callerStandVolumeValues,
    "callerStandVolumeIds",
  );
  input.callerStandVolumeValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedStandVolumeValue, "observation");
  const i = catalogIndex(input.callerStandVolumeIds, input.queryStandVolumeId);
  return {
    callerMatchedStandVolumeValue: input.callerStandVolumeValues[i],
    signedObservedMinusStandVolumeReference:
      input.observedStandVolumeValue - input.callerStandVolumeValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStandVolumeIds: ["a", "b"],
  callerStandVolumeValues: [2, 4],
  queryStandVolumeId: "b",
  observedStandVolumeValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedStandVolumeValue: 4,
  signedObservedMinusStandVolumeReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/stand-volume-table-lookup",
  title: "Stand Volume Table Lookup",
  description:
    "Audit caller species/site/age-matched stand-volume table. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedStandVolumeValue",
      label: "Caller matched stand volume value",
      kind: "number",
    },
    {
      id: "signedObservedMinusStandVolumeReference",
      label: "Signed observed minus stand volume reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStandVolumeIds: value.callerStandVolumeIds as readonly string[],
      callerStandVolumeValues:
        value.callerStandVolumeValues as readonly number[],
      queryStandVolumeId: value.queryStandVolumeId as string,
      observedStandVolumeValue: value.observedStandVolumeValue as number,
    }),
});
export const run = tool.execute;
export default tool;
