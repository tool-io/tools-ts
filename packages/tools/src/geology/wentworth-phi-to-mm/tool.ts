import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly phiBinLower: readonly number[];
  readonly phiBinUpper: readonly number[];
}>;
export type Output = Readonly<{
  readonly diameterLowerMm: readonly number[];
  readonly diameterUpperMm: readonly number[];
}>;
const inputFields = [
  { id: "phiBinLower", label: "Phi bin lower", kind: "numberList" },
  { id: "phiBinUpper", label: "Phi bin upper", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.phiBinLower, input.phiBinUpper, "phiBinLower");
  input.phiBinLower.forEach((v, i) => {
    ordered(v, input.phiBinUpper[i]);
    if (v < -40 || input.phiBinUpper[i] > 40)
      simpleError("phi", "−40..40 explicit intervals.");
  });
  return {
    diameterLowerMm: input.phiBinUpper.map((v) => 2 ** -v),
    diameterUpperMm: input.phiBinLower.map((v) => 2 ** -v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phiBinLower: [-1, 0],
  phiBinUpper: [0, 1],
} satisfies Input;
export const exampleOutput = {
  diameterLowerMm: [1, 0.5],
  diameterUpperMm: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/wentworth-phi-to-mm",
  title: "Geology Wentworth Phi To Mm Calculator",
  description:
    "Invert phi BIN intervals to diameter intervals, decreasing mapping reverses bounds; not arithmetic mean diameter from inverted mean phi. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "diameterLowerMm", label: "Diameter lower mm", kind: "numberList" },
    { id: "diameterUpperMm", label: "Diameter upper mm", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      phiBinLower: value.phiBinLower as readonly number[],
      phiBinUpper: value.phiBinUpper as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
