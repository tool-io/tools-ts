import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCycloneCollectionVolumesM3: readonly number[];
  readonly observedCollectionTimesSeconds: readonly number[];
  readonly observedIndependentInletFlowM3Second: number;
}>;
export type Output = Readonly<{
  readonly observedCollectedCycloneFlowM3Second: number;
  readonly signedInletMinusCollectedFlowM3Second: number;
}>;
const inputFields = [
  {
    id: "observedCycloneCollectionVolumesM3",
    label: "Observed cyclone collection volumes m3",
    kind: "numberList",
  },
  {
    id: "observedCollectionTimesSeconds",
    label: "Observed collection times seconds",
    kind: "numberList",
  },
  {
    id: "observedIndependentInletFlowM3Second",
    label: "Observed independent inlet flow m3 second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCollectionTimesSeconds.forEach((v) =>
    positive(v, "observedCollectionTimesSeconds"),
  );
  input.observedCycloneCollectionVolumesM3.forEach((v) =>
    nonnegative(v, "observedCycloneCollectionVolumesM3"),
  );
  nonnegative(
    input.observedIndependentInletFlowM3Second,
    "observedIndependentInletFlowM3Second",
  );
  aligned(
    input.observedCycloneCollectionVolumesM3,
    input.observedCollectionTimesSeconds,
    "observedCycloneCollectionVolumesM3",
  );
  const flow =
    sum(input.observedCycloneCollectionVolumesM3) /
    sum(input.observedCollectionTimesSeconds);
  return {
    observedCollectedCycloneFlowM3Second: flow,
    signedInletMinusCollectedFlowM3Second:
      input.observedIndependentInletFlowM3Second - flow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCycloneCollectionVolumesM3: [2, 3],
  observedCollectionTimesSeconds: [1, 2],
  observedIndependentInletFlowM3Second: 2,
} satisfies Input;
export const exampleOutput = {
  observedCollectedCycloneFlowM3Second: 1.6666666666666667,
  signedInletMinusCollectedFlowM3Second: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cyclone-flow-rate",
  title: "Cyclone Flow Rate Calculator",
  description:
    "Audit actual timed hydrocyclone collection ledger versus independently measured inlet flow, not Kρv² pressure correlation or nominal vendor capacity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCollectedCycloneFlowM3Second",
      label: "Observed collected cyclone flow m3 second",
      kind: "number",
    },
    {
      id: "signedInletMinusCollectedFlowM3Second",
      label: "Signed inlet minus collected flow m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCycloneCollectionVolumesM3:
        value.observedCycloneCollectionVolumesM3 as readonly number[],
      observedCollectionTimesSeconds:
        value.observedCollectionTimesSeconds as readonly number[],
      observedIndependentInletFlowM3Second:
        value.observedIndependentInletFlowM3Second as number,
    }),
});
export const run = tool.execute;
export default tool;
