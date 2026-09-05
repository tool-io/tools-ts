import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, linearFit } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlySampledHoekBrownSigma3: readonly number[];
  readonly matchedHoekBrownSigma1: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedCohesion: number;
  readonly fittedFrictionAngleDegrees: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "independentlySampledHoekBrownSigma3",
    label: "Independently sampled hoek brown sigma3",
    kind: "numberList",
  },
  {
    id: "matchedHoekBrownSigma1",
    label: "Matched hoek brown sigma1",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(
    input.independentlySampledHoekBrownSigma3,
    input.matchedHoekBrownSigma1,
  );
  if (f.slope < 1 || f.intercept < 0)
    simpleError(
      "branch",
      "Compression-positive equivalent MC slope≥1/intercept≥0.",
    );
  const sine = (f.slope - 1) / (f.slope + 1);
  return {
    fittedCohesion: f.intercept / (2 * Math.sqrt(f.slope)),
    fittedFrictionAngleDegrees: (Math.asin(sine) * 180) / Math.PI,
    fitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlySampledHoekBrownSigma3: [0, 1, 2],
  matchedHoekBrownSigma1: [2, 5, 8],
} satisfies Input;
export const exampleOutput = {
  fittedCohesion: 0.5773502691896258,
  fittedFrictionAngleDegrees: 30,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-mohr-coulomb-cohesion-from-hoek-brown",
  title:
    "Geology Geomechanics Mohr Coulomb Cohesion From Hoek Brown Calculator",
  description:
    "FIT equivalent MC cohesion/friction over independently chosen confinement-window sampled Hoek–Brown envelope, not universal mapping or exact nonlinear envelope. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "fittedCohesion", label: "Fitted cohesion", kind: "number" },
    {
      id: "fittedFrictionAngleDegrees",
      label: "Fitted friction angle degrees",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      independentlySampledHoekBrownSigma3:
        value.independentlySampledHoekBrownSigma3 as readonly number[],
      matchedHoekBrownSigma1: value.matchedHoekBrownSigma1 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
