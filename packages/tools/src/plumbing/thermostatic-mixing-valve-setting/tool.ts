import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedHotFeedC: number;
  readonly observedColdFeedC: number;
  readonly callerRequestedMixedC: number;
  readonly observedTotalMixedLitersMinute: number;
}>;
export type Output = Readonly<{
  readonly idealHotFraction: number;
  readonly idealHotLitersMinute: number;
  readonly idealColdLitersMinute: number;
}>;
const inputFields = [
  { id: "observedHotFeedC", label: "Observed hot feed c", kind: "number" },
  { id: "observedColdFeedC", label: "Observed cold feed c", kind: "number" },
  {
    id: "callerRequestedMixedC",
    label: "Caller requested mixed c",
    kind: "number",
  },
  {
    id: "observedTotalMixedLitersMinute",
    label: "Observed total mixed liters minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedTotalMixedLitersMinute,
    "observedTotalMixedLitersMinute",
  );
  if (input.observedHotFeedC <= input.observedColdFeedC)
    simpleError("mixing", "Distinct hot/cold temperatures required.");
  ordered(input.observedColdFeedC, input.callerRequestedMixedC);
  ordered(input.callerRequestedMixedC, input.observedHotFeedC);
  const f =
    (input.callerRequestedMixedC - input.observedColdFeedC) /
    (input.observedHotFeedC - input.observedColdFeedC);
  return {
    idealHotFraction: f,
    idealHotLitersMinute: f * input.observedTotalMixedLitersMinute,
    idealColdLitersMinute: (1 - f) * input.observedTotalMixedLitersMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHotFeedC: 60,
  observedColdFeedC: 20,
  callerRequestedMixedC: 40,
  observedTotalMixedLitersMinute: 10,
} satisfies Input;
export const exampleOutput = {
  idealHotFraction: 0.5,
  idealHotLitersMinute: 5,
  idealColdLitersMinute: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/thermostatic-mixing-valve-setting",
  title: "Plumbing Thermostatic Mixing Valve Setting Calculator",
  description:
    "Calculate caller ideal steady equal-heat-capacity hot/cold mixing split from actual feeds/flow; no valve setting instructions, control response, legionella or scald safety.",
  inputs: inputFields,
  outputs: [
    { id: "idealHotFraction", label: "Ideal hot fraction", kind: "number" },
    {
      id: "idealHotLitersMinute",
      label: "Ideal hot liters minute",
      kind: "number",
    },
    {
      id: "idealColdLitersMinute",
      label: "Ideal cold liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHotFeedC: value.observedHotFeedC as number,
      observedColdFeedC: value.observedColdFeedC as number,
      callerRequestedMixedC: value.callerRequestedMixedC as number,
      observedTotalMixedLitersMinute:
        value.observedTotalMixedLitersMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
