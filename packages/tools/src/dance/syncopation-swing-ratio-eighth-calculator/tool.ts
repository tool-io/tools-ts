import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPairStartTimesSeconds: readonly number[];
  readonly observedOffbeatTimesSeconds: readonly number[];
  readonly observedNextBeatTimesSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLongShortRatios: readonly number[];
  readonly pooledLongShortRatio: number;
}>;
const inputFields = [
  {
    id: "observedPairStartTimesSeconds",
    label: "Observed pair start times seconds",
    kind: "numberList",
  },
  {
    id: "observedOffbeatTimesSeconds",
    label: "Observed offbeat times seconds",
    kind: "numberList",
  },
  {
    id: "observedNextBeatTimesSeconds",
    label: "Observed next beat times seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPairStartTimesSeconds,
    input.observedOffbeatTimesSeconds,
    "observedPairStartTimesSeconds",
  );
  aligned(
    input.observedPairStartTimesSeconds,
    input.observedNextBeatTimesSeconds,
    "observedPairStartTimesSeconds",
  );
  const a = input.observedPairStartTimesSeconds.map((v, i) =>
      positive(input.observedOffbeatTimesSeconds[i] - v, "first subdivision"),
    ),
    b = input.observedOffbeatTimesSeconds.map((v, i) =>
      positive(input.observedNextBeatTimesSeconds[i] - v, "second subdivision"),
    );
  return {
    observedLongShortRatios: a.map((v, i) => v / b[i]),
    pooledLongShortRatio: sum(a) / sum(b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPairStartTimesSeconds: [0, 1],
  observedOffbeatTimesSeconds: [0.6666666666666666, 1.75],
  observedNextBeatTimesSeconds: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedLongShortRatios: [2, 3],
  pooledLongShortRatio: 2.4285714285714284,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/syncopation-swing-ratio-eighth-calculator",
  title: "Syncopation Swing Ratio Eighth Calculator",
  description:
    "Actual independently annotated swung subdivision timing pairs and pooled duration ratio, not prescribed swing or style identity. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLongShortRatios",
      label: "Observed long short ratios",
      kind: "numberList",
    },
    {
      id: "pooledLongShortRatio",
      label: "Pooled long short ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPairStartTimesSeconds:
        value.observedPairStartTimesSeconds as readonly number[],
      observedOffbeatTimesSeconds:
        value.observedOffbeatTimesSeconds as readonly number[],
      observedNextBeatTimesSeconds:
        value.observedNextBeatTimesSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
