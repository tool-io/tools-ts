import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGateV: readonly number[];
  readonly observedSquareRootSaturationCurrent: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedThresholdGateV: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "observedGateV", label: "Observed gate v", kind: "numberList" },
  {
    id: "observedSquareRootSaturationCurrent",
    label: "Observed square root saturation current",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSquareRootSaturationCurrent.forEach((v) =>
    nonnegative(v, "observedSquareRootSaturationCurrent"),
  );
  const fit = linearFit(
    input.observedGateV,
    input.observedSquareRootSaturationCurrent,
  );
  if (fit.slope === 0)
    simpleError("slope", "Nonzero actual sqrt current branch slope required.");
  return {
    fittedThresholdGateV: -fit.intercept / fit.slope,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGateV: [1, 2, 3],
  observedSquareRootSaturationCurrent: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  fittedThresholdGateV: 0,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/otft-threshold-voltage",
  title: "Semiconductor OTFT Threshold Voltage Calculator",
  description:
    "Extract OTFT branch threshold as actual multi-point sqrt-current gate intercept, no fixed material threshold or body-effect formula; independent branch evidence required.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedThresholdGateV",
      label: "Fitted threshold gate v",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedGateV: value.observedGateV as readonly number[],
      observedSquareRootSaturationCurrent:
        value.observedSquareRootSaturationCurrent as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
