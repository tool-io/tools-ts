import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDiacCurrentAmps: readonly number[];
  readonly observedDiacBreakoverMetric: readonly number[];
  readonly callerBreakoverCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredDiacBreakoverCurrentCrossingsAmps: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDiacCurrentAmps",
    label: "Observed diac current amps",
    kind: "numberList",
  },
  {
    id: "observedDiacBreakoverMetric",
    label: "Observed diac breakover metric",
    kind: "numberList",
  },
  {
    id: "callerBreakoverCriterion",
    label: "Caller breakover criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDiacCurrentAmps.forEach((v) =>
    nonnegative(v, "observedDiacCurrentAmps"),
  );
  input.observedDiacBreakoverMetric.forEach((v) =>
    nonnegative(v, "observedDiacBreakoverMetric"),
  );
  nonnegative(input.callerBreakoverCriterion, "callerBreakoverCriterion");
  return {
    measuredDiacBreakoverCurrentCrossingsAmps: crossings(
      input.observedDiacCurrentAmps,
      input.observedDiacBreakoverMetric,
      input.callerBreakoverCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDiacCurrentAmps: [0, 1, 2],
  observedDiacBreakoverMetric: [0, 2, 4],
  callerBreakoverCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredDiacBreakoverCurrentCrossingsAmps: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/diac-breakover-current",
  title: "Semiconductor Diac Breakover Current Calculator",
  description:
    "Extract all actual piecewise-linear measuredDiacBreakoverCurrentCrossingsAmps test crossings at explicitly supplied callerBreakoverCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredDiacBreakoverCurrentCrossingsAmps",
      label: "Measured diac breakover current crossings amps",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDiacCurrentAmps:
        value.observedDiacCurrentAmps as readonly number[],
      observedDiacBreakoverMetric:
        value.observedDiacBreakoverMetric as readonly number[],
      callerBreakoverCriterion: value.callerBreakoverCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
