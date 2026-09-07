import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  mean,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCfetInputCrossingSeconds: readonly number[];
  readonly observedCfetOutputCrossingSeconds: readonly number[];
  readonly callerTransitionIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly observedCfetPropagationDelaysSeconds: readonly number[];
  readonly meanMatchedCfetPropagationDelaySeconds: number;
}>;
const inputFields = [
  {
    id: "observedCfetInputCrossingSeconds",
    label: "Observed cfet input crossing seconds",
    kind: "numberList",
  },
  {
    id: "observedCfetOutputCrossingSeconds",
    label: "Observed cfet output crossing seconds",
    kind: "numberList",
  },
  {
    id: "callerTransitionIds",
    label: "Caller transition ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCfetInputCrossingSeconds.forEach((v) =>
    nonnegative(v, "observedCfetInputCrossingSeconds"),
  );
  input.observedCfetOutputCrossingSeconds.forEach((v) =>
    nonnegative(v, "observedCfetOutputCrossingSeconds"),
  );
  aligned(
    input.observedCfetInputCrossingSeconds,
    input.observedCfetOutputCrossingSeconds,
    "observedCfetInputCrossingSeconds",
  );
  aligned(
    input.observedCfetInputCrossingSeconds,
    input.callerTransitionIds,
    "observedCfetInputCrossingSeconds",
  );
  unique(input.callerTransitionIds, "transitions");
  const delays = input.observedCfetInputCrossingSeconds.map(
    (v, i) => input.observedCfetOutputCrossingSeconds[i] - v,
  );
  delays.forEach((v) => nonnegative(v, "chronology"));
  return {
    observedCfetPropagationDelaysSeconds: delays,
    meanMatchedCfetPropagationDelaySeconds: mean(delays),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCfetInputCrossingSeconds: [1, 4],
  observedCfetOutputCrossingSeconds: [2, 6],
  callerTransitionIds: ["rise-to-fall", "fall-to-rise"],
} satisfies Input;
export const exampleOutput = {
  observedCfetPropagationDelaysSeconds: [1, 2],
  meanMatchedCfetPropagationDelaySeconds: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/cfet-inverter-delay",
  title: "Semiconductor Cfet Inverter Delay Calculator",
  description:
    "Audit actual paired CFET input/output criterion-crossing times and separate transition labels, not assumed RC load inverter delay.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCfetPropagationDelaysSeconds",
      label: "Observed cfet propagation delays seconds",
      kind: "numberList",
    },
    {
      id: "meanMatchedCfetPropagationDelaySeconds",
      label: "Mean matched cfet propagation delay seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCfetInputCrossingSeconds:
        value.observedCfetInputCrossingSeconds as readonly number[],
      observedCfetOutputCrossingSeconds:
        value.observedCfetOutputCrossingSeconds as readonly number[],
      callerTransitionIds: value.callerTransitionIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
