import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, windowBounds } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerUnwrappedGreenStartsSeconds: readonly number[];
  readonly callerUnwrappedGreenEndsSeconds: readonly number[];
  readonly callerIndependentTravelOffsetsSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly commonWindowStart: number;
  readonly commonWindowEnd: number;
  readonly signedCommonBandwidth: number;
}>;
const inputFields = [
  {
    id: "callerUnwrappedGreenStartsSeconds",
    label: "Caller unwrapped green starts seconds",
    kind: "numberList",
  },
  {
    id: "callerUnwrappedGreenEndsSeconds",
    label: "Caller unwrapped green ends seconds",
    kind: "numberList",
  },
  {
    id: "callerIndependentTravelOffsetsSeconds",
    label: "Caller independent travel offsets seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return windowBounds(
    input.callerUnwrappedGreenStartsSeconds,
    input.callerUnwrappedGreenEndsSeconds,
    input.callerIndependentTravelOffsetsSeconds,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUnwrappedGreenStartsSeconds: [10, 25],
  callerUnwrappedGreenEndsSeconds: [30, 45],
  callerIndependentTravelOffsetsSeconds: [0, 10],
} satisfies Input;
export const exampleOutput = {
  commonWindowStart: 15,
  commonWindowEnd: 30,
  signedCommonBandwidth: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/signal-progression-bandwidth",
  title: "Signal Progression Bandwidth Calculator",
  description:
    "Intersect independently unwrapped green windows after travel offsets; negative bandwidth retained, cycle wrap choices established externally. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "commonWindowStart", label: "Common window start", kind: "number" },
    { id: "commonWindowEnd", label: "Common window end", kind: "number" },
    {
      id: "signedCommonBandwidth",
      label: "Signed common bandwidth",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerUnwrappedGreenStartsSeconds:
        value.callerUnwrappedGreenStartsSeconds as readonly number[],
      callerUnwrappedGreenEndsSeconds:
        value.callerUnwrappedGreenEndsSeconds as readonly number[],
      callerIndependentTravelOffsetsSeconds:
        value.callerIndependentTravelOffsetsSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
