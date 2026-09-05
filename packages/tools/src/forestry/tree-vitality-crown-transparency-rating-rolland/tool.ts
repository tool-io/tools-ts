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
  readonly callerRollandTransparencyIds: readonly string[];
  readonly callerRollandTransparencyValues: readonly number[];
  readonly queryRollandTransparencyId: string;
  readonly observedRollandTransparencyValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedRollandTransparencyValue: number;
  readonly signedObservedMinusRollandTransparencyReference: number;
}>;
const inputFields = [
  {
    id: "callerRollandTransparencyIds",
    label: "Caller rolland transparency ids",
    kind: "stringList",
  },
  {
    id: "callerRollandTransparencyValues",
    label: "Caller rolland transparency values",
    kind: "numberList",
  },
  {
    id: "queryRollandTransparencyId",
    label: "Query rolland transparency id",
    kind: "string",
  },
  {
    id: "observedRollandTransparencyValue",
    label: "Observed rolland transparency value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerRollandTransparencyIds,
    input.callerRollandTransparencyValues,
    "callerRollandTransparencyIds",
  );
  input.callerRollandTransparencyValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedRollandTransparencyValue, "observation");
  const i = catalogIndex(
    input.callerRollandTransparencyIds,
    input.queryRollandTransparencyId,
  );
  return {
    callerMatchedRollandTransparencyValue:
      input.callerRollandTransparencyValues[i],
    signedObservedMinusRollandTransparencyReference:
      input.observedRollandTransparencyValue -
      input.callerRollandTransparencyValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRollandTransparencyIds: ["a", "b"],
  callerRollandTransparencyValues: [2, 4],
  queryRollandTransparencyId: "b",
  observedRollandTransparencyValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedRollandTransparencyValue: 4,
  signedObservedMinusRollandTransparencyReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/tree-vitality-crown-transparency-rating-rolland",
  title: "Rolland Crown Transparency Vitality Rating",
  description:
    "Audit caller Rolland crown-transparency vitality reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedRollandTransparencyValue",
      label: "Caller matched rolland transparency value",
      kind: "number",
    },
    {
      id: "signedObservedMinusRollandTransparencyReference",
      label: "Signed observed minus rolland transparency reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRollandTransparencyIds:
        value.callerRollandTransparencyIds as readonly string[],
      callerRollandTransparencyValues:
        value.callerRollandTransparencyValues as readonly number[],
      queryRollandTransparencyId: value.queryRollandTransparencyId as string,
      observedRollandTransparencyValue:
        value.observedRollandTransparencyValue as number,
    }),
});
export const run = tool.execute;
export default tool;
