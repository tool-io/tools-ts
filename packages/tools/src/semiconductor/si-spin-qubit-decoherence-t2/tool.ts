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
  nonnegative,
  fraction,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedEchoTimesSeconds: readonly number[];
  readonly observedNormalizedEchoEnvelope: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedSpinEchoT2Seconds: number;
  readonly echoFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedEchoTimesSeconds",
    label: "Observed echo times seconds",
    kind: "numberList",
  },
  {
    id: "observedNormalizedEchoEnvelope",
    label: "Observed normalized echo envelope",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedNormalizedEchoEnvelope.forEach((v) =>
    positive(v, "observedNormalizedEchoEnvelope"),
  );
  input.observedEchoTimesSeconds.forEach((v) =>
    nonnegative(v, "observedEchoTimesSeconds"),
  );
  input.observedNormalizedEchoEnvelope.forEach((v) =>
    fraction(v, "observedNormalizedEchoEnvelope"),
  );
  const fit = linearFit(
    input.observedEchoTimesSeconds,
    input.observedNormalizedEchoEnvelope.map(Math.log),
  );
  if (fit.slope >= 0)
    simpleError(
      "echo",
      "Decreasing independently normalized exponential echo envelope required.",
    );
  return {
    fittedSpinEchoT2Seconds: -1 / fit.slope,
    echoFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEchoTimesSeconds: [0, 1, 2],
  observedNormalizedEchoEnvelope: [1, 0.5, 0.25],
} satisfies Input;
export const exampleOutput = {
  fittedSpinEchoT2Seconds: 1.4426950408889634,
  echoFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/si-spin-qubit-decoherence-t2",
  title: "Semiconductor Si Spin Qubit Decoherence T2 Calculator",
  description:
    "Extract actual Si-spin echo exponential T2 with independently normalized envelope, not Ramsey T2*, spin diffusion spatial length, arbitrary stretched exponent or readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedSpinEchoT2Seconds",
      label: "Fitted spin echo t2 seconds",
      kind: "number",
    },
    { id: "echoFitRSquared", label: "Echo fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedEchoTimesSeconds:
        value.observedEchoTimesSeconds as readonly number[],
      observedNormalizedEchoEnvelope:
        value.observedNormalizedEchoEnvelope as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
