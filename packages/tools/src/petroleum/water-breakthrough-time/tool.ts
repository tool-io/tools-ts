import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sequence,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedFloodTimesDays: readonly number[];
  readonly observedCumulativeInjectedWaterM3: readonly number[];
  readonly callerIndependentlyEstablishedBreakthroughInjectedM3: number;
}>;
export type Output = Readonly<{
  readonly observedBreakthroughVolumeCrossingDays: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFloodTimesDays",
    label: "Observed flood times days",
    kind: "numberList",
  },
  {
    id: "observedCumulativeInjectedWaterM3",
    label: "Observed cumulative injected water m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedBreakthroughInjectedM3",
    label: "Caller independently established breakthrough injected m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFloodTimesDays.forEach((v) =>
    nonnegative(v, "observedFloodTimesDays"),
  );
  input.observedCumulativeInjectedWaterM3.forEach((v) =>
    nonnegative(v, "observedCumulativeInjectedWaterM3"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedBreakthroughInjectedM3,
    "callerIndependentlyEstablishedBreakthroughInjectedM3",
  );
  sequence(input.observedCumulativeInjectedWaterM3, "cumulative injection");
  return {
    observedBreakthroughVolumeCrossingDays: crossings(
      input.observedFloodTimesDays,
      input.observedCumulativeInjectedWaterM3,
      input.callerIndependentlyEstablishedBreakthroughInjectedM3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFloodTimesDays: [0, 1, 3],
  observedCumulativeInjectedWaterM3: [0, 10, 30],
  callerIndependentlyEstablishedBreakthroughInjectedM3: 20,
} satisfies Input;
export const exampleOutput = {
  observedBreakthroughVolumeCrossingDays: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/water-breakthrough-time",
  title: "Petroleum Water Breakthrough Time Calculator",
  description:
    "Route actual cumulative flood injection history to independently established breakthrough-volume criterion, no constant rate, assumed shock saturation or operation deadline. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBreakthroughVolumeCrossingDays",
      label: "Observed breakthrough volume crossing days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFloodTimesDays: value.observedFloodTimesDays as readonly number[],
      observedCumulativeInjectedWaterM3:
        value.observedCumulativeInjectedWaterM3 as readonly number[],
      callerIndependentlyEstablishedBreakthroughInjectedM3:
        value.callerIndependentlyEstablishedBreakthroughInjectedM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
