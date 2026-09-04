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
  readonly callerStandClassDensityIds: readonly string[];
  readonly callerStandClassDensityValues: readonly number[];
  readonly queryStandClassDensityId: string;
  readonly observedStandClassDensityValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedStandClassDensityValue: number;
  readonly signedObservedMinusStandClassDensityReference: number;
}>;
const inputFields = [
  {
    id: "callerStandClassDensityIds",
    label: "Caller stand class density ids",
    kind: "stringList",
  },
  {
    id: "callerStandClassDensityValues",
    label: "Caller stand class density values",
    kind: "numberList",
  },
  {
    id: "queryStandClassDensityId",
    label: "Query stand class density id",
    kind: "string",
  },
  {
    id: "observedStandClassDensityValue",
    label: "Observed stand class density value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerStandClassDensityIds,
    input.callerStandClassDensityValues,
    "callerStandClassDensityIds",
  );
  input.callerStandClassDensityValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedStandClassDensityValue, "observation");
  const i = catalogIndex(
    input.callerStandClassDensityIds,
    input.queryStandClassDensityId,
  );
  return {
    callerMatchedStandClassDensityValue: input.callerStandClassDensityValues[i],
    signedObservedMinusStandClassDensityReference:
      input.observedStandClassDensityValue -
      input.callerStandClassDensityValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStandClassDensityIds: ["a", "b"],
  callerStandClassDensityValues: [2, 4],
  queryStandClassDensityId: "b",
  observedStandClassDensityValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedStandClassDensityValue: 4,
  signedObservedMinusStandClassDensityReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/stand-table-lookup",
  title: "Stand Table Lookup",
  description:
    "Audit caller diameter-class stand inventory table. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedStandClassDensityValue",
      label: "Caller matched stand class density value",
      kind: "number",
    },
    {
      id: "signedObservedMinusStandClassDensityReference",
      label: "Signed observed minus stand class density reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStandClassDensityIds:
        value.callerStandClassDensityIds as readonly string[],
      callerStandClassDensityValues:
        value.callerStandClassDensityValues as readonly number[],
      queryStandClassDensityId: value.queryStandClassDensityId as string,
      observedStandClassDensityValue:
        value.observedStandClassDensityValue as number,
    }),
});
export const run = tool.execute;
export default tool;
