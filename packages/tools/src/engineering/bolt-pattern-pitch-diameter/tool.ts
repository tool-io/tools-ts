import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fullCircle } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBoltCentersXyM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly fittedPitchCircleCenterM: readonly number[];
  readonly fittedPitchDiameterM: number;
  readonly radialFitRmseM: number;
}>;
const inputFields = [
  {
    id: "observedBoltCentersXyM",
    label: "Observed bolt centers xy m",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = fullCircle(input.observedBoltCentersXyM);
  return {
    fittedPitchCircleCenterM: f.center,
    fittedPitchDiameterM: 2 * f.radius,
    radialFitRmseM: f.radialRmse,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoltCentersXyM: [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ],
} satisfies Input;
export const exampleOutput = {
  fittedPitchCircleCenterM: [0, 0],
  fittedPitchDiameterM: 2,
  radialFitRmseM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/bolt-pattern-pitch-diameter",
  title: "Bolt Pattern Pitch Diameter Calculator",
  description:
    "Algebraic fitted pitch circle from actual noncollinear planar bolt centers with radial residual, not nominal radius×2. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedPitchCircleCenterM",
      label: "Fitted pitch circle center m",
      kind: "numberList",
    },
    {
      id: "fittedPitchDiameterM",
      label: "Fitted pitch diameter m",
      kind: "number",
    },
    { id: "radialFitRmseM", label: "Radial fit rmse m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedBoltCentersXyM:
        value.observedBoltCentersXyM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
