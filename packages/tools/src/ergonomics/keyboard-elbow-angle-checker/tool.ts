import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedElbowDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedNamedAngleMargins: readonly number[];
  readonly outsideNamedAngleIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedElbowDegrees",
    label: "Observed elbow degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedElbowDegrees.forEach((v) => {
    if (v < 0 || v > 180)
      simpleError("angle", "0..180 observed elbow flexion.");
  });
  return {
    signedNamedAngleMargins: input.observedElbowDegrees.map((v) =>
      Math.min(v - 90, 110 - v),
    ),
    outsideNamedAngleIndices: input.observedElbowDegrees.flatMap((v, i) =>
      v < 90 || v > 110 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedElbowDegrees: [90, 120] } satisfies Input;
export const exampleOutput = {
  signedNamedAngleMargins: [0, -10],
  outsideNamedAngleIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/keyboard-elbow-angle-checker",
  title: "Keyboard Elbow Angle 90-110 Degree Checker",
  description:
    "Audit measured keyboard elbow angles against named90–110° interval; not universal comfort or injury-prevention evidence. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedNamedAngleMargins",
      label: "Signed named angle margins",
      kind: "numberList",
    },
    {
      id: "outsideNamedAngleIndices",
      label: "Outside named angle indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElbowDegrees: value.observedElbowDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
