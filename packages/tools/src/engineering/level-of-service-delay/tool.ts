import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedControlDelaysSeconds: readonly number[];
  readonly callerInclusiveDelayClassUpperSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerDelayClassIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedControlDelaysSeconds",
    label: "Observed control delays seconds",
    kind: "numberList",
  },
  {
    id: "callerInclusiveDelayClassUpperSeconds",
    label: "Caller inclusive delay class upper seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedControlDelaysSeconds.forEach((v) =>
    nonnegative(v, "observedControlDelaysSeconds"),
  );
  input.callerInclusiveDelayClassUpperSeconds.forEach((v) =>
    nonnegative(v, "callerInclusiveDelayClassUpperSeconds"),
  );
  strictlyIncreasing(
    input.callerInclusiveDelayClassUpperSeconds,
    "inclusive class edges",
    1,
  );
  return {
    callerDelayClassIndices: input.observedControlDelaysSeconds.map((v) => {
      const i = input.callerInclusiveDelayClassUpperSeconds.findIndex(
        (e) => v <= e,
      );
      return i < 0 ? input.callerInclusiveDelayClassUpperSeconds.length : i;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedControlDelaysSeconds: [5, 20, 40],
  callerInclusiveDelayClassUpperSeconds: [10, 30, 50],
} satisfies Input;
export const exampleOutput = {
  callerDelayClassIndices: [0, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/level-of-service-delay",
  title: "Level of Service Delay Calculator",
  description:
    "Classify actual observed control delay with independently verified facility/edition inclusive class edges; no universal LOS thresholds or computed queue delay. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDelayClassIndices",
      label: "Caller delay class indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedControlDelaysSeconds:
        value.observedControlDelaysSeconds as readonly number[],
      callerInclusiveDelayClassUpperSeconds:
        value.callerInclusiveDelayClassUpperSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
