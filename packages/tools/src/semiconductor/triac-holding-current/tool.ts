import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTriacOnStateAmps: readonly number[];
  readonly observedTriacConductionMetric: readonly number[];
  readonly callerHoldingConductionCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredTriacHoldingCurrentCrossingsAmps: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTriacOnStateAmps",
    label: "Observed triac on state amps",
    kind: "numberList",
  },
  {
    id: "observedTriacConductionMetric",
    label: "Observed triac conduction metric",
    kind: "numberList",
  },
  {
    id: "callerHoldingConductionCriterion",
    label: "Caller holding conduction criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTriacOnStateAmps.forEach((v) =>
    nonnegative(v, "observedTriacOnStateAmps"),
  );
  input.observedTriacConductionMetric.forEach((v) =>
    nonnegative(v, "observedTriacConductionMetric"),
  );
  nonnegative(
    input.callerHoldingConductionCriterion,
    "callerHoldingConductionCriterion",
  );
  return {
    measuredTriacHoldingCurrentCrossingsAmps: crossings(
      input.observedTriacOnStateAmps,
      input.observedTriacConductionMetric,
      input.callerHoldingConductionCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTriacOnStateAmps: [0, 1, 2],
  observedTriacConductionMetric: [0, 2, 4],
  callerHoldingConductionCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredTriacHoldingCurrentCrossingsAmps: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/triac-holding-current",
  title: "Semiconductor Triac Holding Current Calculator",
  description:
    "Extract all actual piecewise-linear measuredTriacHoldingCurrentCrossingsAmps test crossings at explicitly supplied callerHoldingConductionCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredTriacHoldingCurrentCrossingsAmps",
      label: "Measured triac holding current crossings amps",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTriacOnStateAmps:
        value.observedTriacOnStateAmps as readonly number[],
      observedTriacConductionMetric:
        value.observedTriacConductionMetric as readonly number[],
      callerHoldingConductionCriterion:
        value.callerHoldingConductionCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
