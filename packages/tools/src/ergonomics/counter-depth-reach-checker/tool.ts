import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedFunctionalReachCm: number;
  readonly observedCounterDepthCm: number;
  readonly observedFrontBodySetbackCm: number;
}>;
export type Output = Readonly<{
  readonly signedBackCounterReachReserveCm: number;
}>;
const inputFields = [
  {
    id: "observedFunctionalReachCm",
    label: "Observed functional reach cm",
    kind: "number",
  },
  {
    id: "observedCounterDepthCm",
    label: "Observed counter depth cm",
    kind: "number",
  },
  {
    id: "observedFrontBodySetbackCm",
    label: "Observed front body setback cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFunctionalReachCm, "observedFunctionalReachCm");
  positive(input.observedCounterDepthCm, "observedCounterDepthCm");
  nonnegative(input.observedFrontBodySetbackCm, "observedFrontBodySetbackCm");
  return {
    signedBackCounterReachReserveCm:
      input.observedFunctionalReachCm -
      input.observedCounterDepthCm -
      input.observedFrontBodySetbackCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFunctionalReachCm: 60,
  observedCounterDepthCm: 50,
  observedFrontBodySetbackCm: 15,
} satisfies Input;
export const exampleOutput = {
  signedBackCounterReachReserveCm: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/counter-depth-reach-checker",
  title: "Anthropometric Counter Depth Forward Reach Kitchen Checker",
  description:
    "Measured kitchen functional reach minus counter and actual body setback; not recommending unsafe maximum reach. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBackCounterReachReserveCm",
      label: "Signed back counter reach reserve cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFunctionalReachCm: value.observedFunctionalReachCm as number,
      observedCounterDepthCm: value.observedCounterDepthCm as number,
      observedFrontBodySetbackCm: value.observedFrontBodySetbackCm as number,
    }),
});
export const run = tool.execute;
export default tool;
