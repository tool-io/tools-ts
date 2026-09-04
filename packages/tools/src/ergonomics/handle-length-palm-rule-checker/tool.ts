import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedHandleLengthMm: number;
  readonly observedPalmBreadthMm: number;
  readonly callerEndClearanceMm: number;
}>;
export type Output = Readonly<{
  readonly signedHandleLengthClearanceMm: number;
}>;
const inputFields = [
  {
    id: "observedHandleLengthMm",
    label: "Observed handle length mm",
    kind: "number",
  },
  {
    id: "observedPalmBreadthMm",
    label: "Observed palm breadth mm",
    kind: "number",
  },
  {
    id: "callerEndClearanceMm",
    label: "Caller end clearance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedHandleLengthMm, "observedHandleLengthMm");
  positive(input.observedPalmBreadthMm, "observedPalmBreadthMm");
  nonnegative(input.callerEndClearanceMm, "callerEndClearanceMm");
  return {
    signedHandleLengthClearanceMm:
      input.observedHandleLengthMm -
      input.observedPalmBreadthMm -
      2 * input.callerEndClearanceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHandleLengthMm: 110,
  observedPalmBreadthMm: 90,
  callerEndClearanceMm: 15,
} satisfies Input;
export const exampleOutput = {
  signedHandleLengthClearanceMm: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/handle-length-palm-rule-checker",
  title: "Handle Length Palm Width Minimum Rule Checker",
  description:
    "Handle length minus actual palm breadth and two caller-specified end clearances, not grip-diameter or force rule. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedHandleLengthClearanceMm",
      label: "Signed handle length clearance mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHandleLengthMm: value.observedHandleLengthMm as number,
      observedPalmBreadthMm: value.observedPalmBreadthMm as number,
      callerEndClearanceMm: value.callerEndClearanceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
