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
  readonly callerChristmasRotationIds: readonly string[];
  readonly callerChristmasRotationValues: readonly number[];
  readonly queryChristmasRotationId: string;
  readonly observedChristmasRotationValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedChristmasRotationValue: number;
  readonly signedObservedMinusChristmasRotationReference: number;
}>;
const inputFields = [
  {
    id: "callerChristmasRotationIds",
    label: "Caller christmas rotation ids",
    kind: "stringList",
  },
  {
    id: "callerChristmasRotationValues",
    label: "Caller christmas rotation values",
    kind: "numberList",
  },
  {
    id: "queryChristmasRotationId",
    label: "Query christmas rotation id",
    kind: "string",
  },
  {
    id: "observedChristmasRotationValue",
    label: "Observed christmas rotation value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerChristmasRotationIds,
    input.callerChristmasRotationValues,
    "callerChristmasRotationIds",
  );
  input.callerChristmasRotationValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedChristmasRotationValue, "observation");
  const i = catalogIndex(
    input.callerChristmasRotationIds,
    input.queryChristmasRotationId,
  );
  return {
    callerMatchedChristmasRotationValue: input.callerChristmasRotationValues[i],
    signedObservedMinusChristmasRotationReference:
      input.observedChristmasRotationValue -
      input.callerChristmasRotationValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerChristmasRotationIds: ["a", "b"],
  callerChristmasRotationValues: [2, 4],
  queryChristmasRotationId: "b",
  observedChristmasRotationValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedChristmasRotationValue: 4,
  signedObservedMinusChristmasRotationReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/christmas-tree-rotation-years-by-site-quality",
  title: "Christmas Tree Rotation Years By Site Quality",
  description:
    "Audit independently verified Christmas-tree site-quality rotation reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedChristmasRotationValue",
      label: "Caller matched christmas rotation value",
      kind: "number",
    },
    {
      id: "signedObservedMinusChristmasRotationReference",
      label: "Signed observed minus christmas rotation reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerChristmasRotationIds:
        value.callerChristmasRotationIds as readonly string[],
      callerChristmasRotationValues:
        value.callerChristmasRotationValues as readonly number[],
      queryChristmasRotationId: value.queryChristmasRotationId as string,
      observedChristmasRotationValue:
        value.observedChristmasRotationValue as number,
    }),
});
export const run = tool.execute;
export default tool;
