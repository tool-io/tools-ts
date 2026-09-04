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
  readonly observedEmberFlightSegmentSeconds: readonly number[];
  readonly observedMatchedHorizontalWindMSecond: readonly number[];
  readonly observedIndependentSpotDistanceM: number;
}>;
export type Output = Readonly<{
  readonly observedAdvectiveSpotDistanceM: number;
  readonly signedSpotMinusAdvectionM: number;
}>;
const inputFields = [
  {
    id: "observedEmberFlightSegmentSeconds",
    label: "Observed ember flight segment seconds",
    kind: "numberList",
  },
  {
    id: "observedMatchedHorizontalWindMSecond",
    label: "Observed matched horizontal wind m second",
    kind: "numberList",
  },
  {
    id: "observedIndependentSpotDistanceM",
    label: "Observed independent spot distance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEmberFlightSegmentSeconds.forEach((v) =>
    positive(v, "observedEmberFlightSegmentSeconds"),
  );
  nonnegative(
    input.observedIndependentSpotDistanceM,
    "observedIndependentSpotDistanceM",
  );
  aligned(
    input.observedEmberFlightSegmentSeconds,
    input.observedMatchedHorizontalWindMSecond,
    "observedEmberFlightSegmentSeconds",
  );
  const distance = sum(
    input.observedEmberFlightSegmentSeconds.map(
      (v, i) => v * input.observedMatchedHorizontalWindMSecond[i],
    ),
  );
  return {
    observedAdvectiveSpotDistanceM: distance,
    signedSpotMinusAdvectionM:
      input.observedIndependentSpotDistanceM - distance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEmberFlightSegmentSeconds: [2, 3],
  observedMatchedHorizontalWindMSecond: [1, 2],
  observedIndependentSpotDistanceM: 10,
} satisfies Input;
export const exampleOutput = {
  observedAdvectiveSpotDistanceM: 8,
  signedSpotMinusAdvectionM: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/crown-fire-active-spotting-distance",
  title: "Active Crown Fire Spotting Distance Calculator",
  description:
    "Audit already observed crown-fire ember segment residence/wind advection against independent spot distance; no plume rise, ember launch, maximum safe distance or tactical forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAdvectiveSpotDistanceM",
      label: "Observed advective spot distance m",
      kind: "number",
    },
    {
      id: "signedSpotMinusAdvectionM",
      label: "Signed spot minus advection m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEmberFlightSegmentSeconds:
        value.observedEmberFlightSegmentSeconds as readonly number[],
      observedMatchedHorizontalWindMSecond:
        value.observedMatchedHorizontalWindMSecond as readonly number[],
      observedIndependentSpotDistanceM:
        value.observedIndependentSpotDistanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
