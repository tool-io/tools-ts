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
  readonly callerFineFuelMoistureIds: readonly string[];
  readonly callerFineFuelMoistureValues: readonly number[];
  readonly queryFineFuelMoistureId: string;
  readonly observedFineFuelMoistureValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedFineFuelMoistureValue: number;
  readonly signedObservedMinusFineFuelMoistureReference: number;
}>;
const inputFields = [
  {
    id: "callerFineFuelMoistureIds",
    label: "Caller fine fuel moisture ids",
    kind: "stringList",
  },
  {
    id: "callerFineFuelMoistureValues",
    label: "Caller fine fuel moisture values",
    kind: "numberList",
  },
  {
    id: "queryFineFuelMoistureId",
    label: "Query fine fuel moisture id",
    kind: "string",
  },
  {
    id: "observedFineFuelMoistureValue",
    label: "Observed fine fuel moisture value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerFineFuelMoistureIds,
    input.callerFineFuelMoistureValues,
    "callerFineFuelMoistureIds",
  );
  input.callerFineFuelMoistureValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedFineFuelMoistureValue, "observation");
  const i = catalogIndex(
    input.callerFineFuelMoistureIds,
    input.queryFineFuelMoistureId,
  );
  return {
    callerMatchedFineFuelMoistureValue: input.callerFineFuelMoistureValues[i],
    signedObservedMinusFineFuelMoistureReference:
      input.observedFineFuelMoistureValue -
      input.callerFineFuelMoistureValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFineFuelMoistureIds: ["a", "b"],
  callerFineFuelMoistureValues: [2, 4],
  queryFineFuelMoistureId: "b",
  observedFineFuelMoistureValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedFineFuelMoistureValue: 4,
  signedObservedMinusFineFuelMoistureReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fine-dead-fuel-moisture-1hr-table",
  title: "1-Hour Fine Dead Fuel Moisture Table Lookup",
  description:
    "Audit independently verified1-hour fine fuel moisture reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedFineFuelMoistureValue",
      label: "Caller matched fine fuel moisture value",
      kind: "number",
    },
    {
      id: "signedObservedMinusFineFuelMoistureReference",
      label: "Signed observed minus fine fuel moisture reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFineFuelMoistureIds:
        value.callerFineFuelMoistureIds as readonly string[],
      callerFineFuelMoistureValues:
        value.callerFineFuelMoistureValues as readonly number[],
      queryFineFuelMoistureId: value.queryFineFuelMoistureId as string,
      observedFineFuelMoistureValue:
        value.observedFineFuelMoistureValue as number,
    }),
});
export const run = tool.execute;
export default tool;
