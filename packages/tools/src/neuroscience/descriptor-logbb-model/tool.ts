import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly logP: number;
  readonly polarSurfaceAreaAngstrom2: number;
  readonly logPCoefficient: number;
  readonly psaCoefficient: number;
  readonly intercept: number;
}>;
export type Output = Readonly<{
  readonly predictedLogBB: number;
  readonly predictedBrainPlasmaRatio: number;
}>;
const inputFields = [
  { id: "logP", label: "Log p", kind: "number" },
  {
    id: "polarSurfaceAreaAngstrom2",
    label: "Polar surface area angstrom2",
    kind: "number",
  },
  { id: "logPCoefficient", label: "Log p coefficient", kind: "number" },
  { id: "psaCoefficient", label: "Psa coefficient", kind: "number" },
  { id: "intercept", label: "Intercept", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.polarSurfaceAreaAngstrom2, "polarSurfaceAreaAngstrom2");
  const predictedLogBB =
    input.intercept +
    input.logPCoefficient * input.logP +
    input.psaCoefficient * input.polarSurfaceAreaAngstrom2;
  return { predictedLogBB, predictedBrainPlasmaRatio: 10 ** predictedLogBB };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  logP: 2,
  polarSurfaceAreaAngstrom2: 50,
  logPCoefficient: 0.152,
  psaCoefficient: -0.0148,
  intercept: 0.139,
} satisfies Input;
export const exampleOutput = {
  predictedLogBB: -0.297,
  predictedBrainPlasmaRatio: 0.5046612975635284,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/descriptor-logbb-model",
  title: "Blood Brain Barrier LogBB",
  description:
    "Evaluate a supplied linear descriptor log10(brain/plasma) model; coefficients must be calibrated externally and predictions are not BBB transport or clinical efficacy claims.",
  inputs: inputFields,
  outputs: [
    { id: "predictedLogBB", label: "Predicted log b b", kind: "number" },
    {
      id: "predictedBrainPlasmaRatio",
      label: "Predicted brain plasma ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      logP: value.logP as number,
      polarSurfaceAreaAngstrom2: value.polarSurfaceAreaAngstrom2 as number,
      logPCoefficient: value.logPCoefficient as number,
      psaCoefficient: value.psaCoefficient as number,
      intercept: value.intercept as number,
    }),
});
export const run = tool.execute;
export default tool;
