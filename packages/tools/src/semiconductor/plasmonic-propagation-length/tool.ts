import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPlasmonPositionsM: readonly number[];
  readonly observedPlasmonIntensity: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedIntensityPropagationLengthM: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedPlasmonPositionsM",
    label: "Observed plasmon positions m",
    kind: "numberList",
  },
  {
    id: "observedPlasmonIntensity",
    label: "Observed plasmon intensity",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPlasmonIntensity.forEach((v) =>
    positive(v, "observedPlasmonIntensity"),
  );
  const fit = linearFit(
    input.observedPlasmonPositionsM,
    input.observedPlasmonIntensity.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError(
      "attenuation",
      "Decreasing measured intensity exponential branch required.",
    );
  return {
    fittedIntensityPropagationLengthM: -1 / fit.slope,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlasmonPositionsM: [0, 1, 2],
  observedPlasmonIntensity: [4, 2, 1],
} satisfies Input;
export const exampleOutput = {
  fittedIntensityPropagationLengthM: 1.4426950408889634,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/plasmonic-propagation-length",
  title: "Semiconductor Plasmonic Propagation Length Calculator",
  description:
    "Extract actual intensity 1/e plasmonic propagation length from log-intensity spatial fit, not field-amplitude factor-of-two length, or supplied loss times distance.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedIntensityPropagationLengthM",
      label: "Fitted intensity propagation length m",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPlasmonPositionsM:
        value.observedPlasmonPositionsM as readonly number[],
      observedPlasmonIntensity:
        value.observedPlasmonIntensity as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
