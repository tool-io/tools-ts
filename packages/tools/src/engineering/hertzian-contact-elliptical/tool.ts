import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly normalForceN: number;
  readonly callerIndependentHertzSemiAxisAM: number;
  readonly callerIndependentHertzSemiAxisBM: number;
}>;
export type Output = Readonly<{ readonly ellipticHertzPeakPressurePa: number }>;
const inputFields = [
  { id: "normalForceN", label: "Normal force n", kind: "number" },
  {
    id: "callerIndependentHertzSemiAxisAM",
    label: "Caller independent hertz semi axis a m",
    kind: "number",
  },
  {
    id: "callerIndependentHertzSemiAxisBM",
    label: "Caller independent hertz semi axis b m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentHertzSemiAxisAM,
    "callerIndependentHertzSemiAxisAM",
  );
  positive(
    input.callerIndependentHertzSemiAxisBM,
    "callerIndependentHertzSemiAxisBM",
  );
  nonnegative(input.normalForceN, "normalForceN");
  return {
    ellipticHertzPeakPressurePa:
      (3 * input.normalForceN) /
      positive(
        2 *
          Math.PI *
          input.callerIndependentHertzSemiAxisAM *
          input.callerIndependentHertzSemiAxisBM,
        "resolved finite elliptical contact area",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalForceN: 10,
  callerIndependentHertzSemiAxisAM: 0.5,
  callerIndependentHertzSemiAxisBM: 0.25,
} satisfies Input;
export const exampleOutput = {
  ellipticHertzPeakPressurePa: 38.197186342054884,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hertzian-contact-elliptical",
  title: "Elliptical Hertzian Contact Calculator",
  description:
    "Evaluate normalized elliptical Hertz pressure distribution using independently resolved semiaxes, not solving elliptic contact geometry from unspecified curvatures. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "ellipticHertzPeakPressurePa",
      label: "Elliptic hertz peak pressure pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      normalForceN: value.normalForceN as number,
      callerIndependentHertzSemiAxisAM:
        value.callerIndependentHertzSemiAxisAM as number,
      callerIndependentHertzSemiAxisBM:
        value.callerIndependentHertzSemiAxisBM as number,
    }),
});
export const run = tool.execute;
export default tool;
