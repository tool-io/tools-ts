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
  readonly callerHundredHourMoistureIds: readonly string[];
  readonly callerHundredHourMoistureValues: readonly number[];
  readonly queryHundredHourMoistureId: string;
  readonly observedHundredHourMoistureValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedHundredHourMoistureValue: number;
  readonly signedObservedMinusHundredHourMoistureReference: number;
}>;
const inputFields = [
  {
    id: "callerHundredHourMoistureIds",
    label: "Caller hundred hour moisture ids",
    kind: "stringList",
  },
  {
    id: "callerHundredHourMoistureValues",
    label: "Caller hundred hour moisture values",
    kind: "numberList",
  },
  {
    id: "queryHundredHourMoistureId",
    label: "Query hundred hour moisture id",
    kind: "string",
  },
  {
    id: "observedHundredHourMoistureValue",
    label: "Observed hundred hour moisture value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerHundredHourMoistureIds,
    input.callerHundredHourMoistureValues,
    "callerHundredHourMoistureIds",
  );
  input.callerHundredHourMoistureValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedHundredHourMoistureValue, "observation");
  const i = catalogIndex(
    input.callerHundredHourMoistureIds,
    input.queryHundredHourMoistureId,
  );
  return {
    callerMatchedHundredHourMoistureValue:
      input.callerHundredHourMoistureValues[i],
    signedObservedMinusHundredHourMoistureReference:
      input.observedHundredHourMoistureValue -
      input.callerHundredHourMoistureValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHundredHourMoistureIds: ["a", "b"],
  callerHundredHourMoistureValues: [2, 4],
  queryHundredHourMoistureId: "b",
  observedHundredHourMoistureValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedHundredHourMoistureValue: 4,
  signedObservedMinusHundredHourMoistureReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fire-behavior-hundred-hour-moisture-class",
  title: "100-Hour Moisture Class Lookup",
  description:
    "Audit independently verified100-hour fuel moisture class reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedHundredHourMoistureValue",
      label: "Caller matched hundred hour moisture value",
      kind: "number",
    },
    {
      id: "signedObservedMinusHundredHourMoistureReference",
      label: "Signed observed minus hundred hour moisture reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHundredHourMoistureIds:
        value.callerHundredHourMoistureIds as readonly string[],
      callerHundredHourMoistureValues:
        value.callerHundredHourMoistureValues as readonly number[],
      queryHundredHourMoistureId: value.queryHundredHourMoistureId as string,
      observedHundredHourMoistureValue:
        value.observedHundredHourMoistureValue as number,
    }),
});
export const run = tool.execute;
export default tool;
