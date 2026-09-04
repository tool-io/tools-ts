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
  readonly callerRegionalBoardFootFactorIds: readonly string[];
  readonly callerRegionalBoardFootFactorValues: readonly number[];
  readonly queryRegionalBoardFootFactorId: string;
  readonly observedRegionalBoardFootFactorValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedRegionalBoardFootFactorValue: number;
  readonly signedObservedMinusRegionalBoardFootFactorReference: number;
}>;
const inputFields = [
  {
    id: "callerRegionalBoardFootFactorIds",
    label: "Caller regional board foot factor ids",
    kind: "stringList",
  },
  {
    id: "callerRegionalBoardFootFactorValues",
    label: "Caller regional board foot factor values",
    kind: "numberList",
  },
  {
    id: "queryRegionalBoardFootFactorId",
    label: "Query regional board foot factor id",
    kind: "string",
  },
  {
    id: "observedRegionalBoardFootFactorValue",
    label: "Observed regional board foot factor value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerRegionalBoardFootFactorIds,
    input.callerRegionalBoardFootFactorValues,
    "callerRegionalBoardFootFactorIds",
  );
  input.callerRegionalBoardFootFactorValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedRegionalBoardFootFactorValue, "observation");
  const i = catalogIndex(
    input.callerRegionalBoardFootFactorIds,
    input.queryRegionalBoardFootFactorId,
  );
  return {
    callerMatchedRegionalBoardFootFactorValue:
      input.callerRegionalBoardFootFactorValues[i],
    signedObservedMinusRegionalBoardFootFactorReference:
      input.observedRegionalBoardFootFactorValue -
      input.callerRegionalBoardFootFactorValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRegionalBoardFootFactorIds: ["a", "b"],
  callerRegionalBoardFootFactorValues: [2, 4],
  queryRegionalBoardFootFactorId: "b",
  observedRegionalBoardFootFactorValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedRegionalBoardFootFactorValue: 4,
  signedObservedMinusRegionalBoardFootFactorReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/cubic-to-board-foot-conversion-region-factor",
  title: "Regional Cubic to Board Foot Factor Lookup",
  description:
    "Audit independently matched regional cubic-to-board-foot conversion factor. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedRegionalBoardFootFactorValue",
      label: "Caller matched regional board foot factor value",
      kind: "number",
    },
    {
      id: "signedObservedMinusRegionalBoardFootFactorReference",
      label: "Signed observed minus regional board foot factor reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRegionalBoardFootFactorIds:
        value.callerRegionalBoardFootFactorIds as readonly string[],
      callerRegionalBoardFootFactorValues:
        value.callerRegionalBoardFootFactorValues as readonly number[],
      queryRegionalBoardFootFactorId:
        value.queryRegionalBoardFootFactorId as string,
      observedRegionalBoardFootFactorValue:
        value.observedRegionalBoardFootFactorValue as number,
    }),
});
export const run = tool.execute;
export default tool;
