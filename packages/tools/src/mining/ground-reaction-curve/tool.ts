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
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly displacementsMm: readonly number[];
  readonly initialPressureMpa: number;
  readonly unloadingStiffnessMpaPerMm: number;
  readonly residualPressureMpa: number;
}>;
export type Output = Readonly<{
  readonly requiredSupportPressuresMpa: readonly number[];
  readonly residualTransitionDisplacementMm: number;
}>;
const inputFields = [
  { id: "displacementsMm", label: "Displacements mm", kind: "numberList" },
  { id: "initialPressureMpa", label: "Initial pressure mpa", kind: "number" },
  {
    id: "unloadingStiffnessMpaPerMm",
    label: "Unloading stiffness mpa per mm",
    kind: "number",
  },
  { id: "residualPressureMpa", label: "Residual pressure mpa", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialPressureMpa, "initialPressureMpa");
  positive(input.unloadingStiffnessMpaPerMm, "unloadingStiffnessMpaPerMm");
  input.displacementsMm.forEach((v) => nonnegative(v, "displacementsMm"));
  nonnegative(input.residualPressureMpa, "residualPressureMpa");
  ordered(input.displacementsMm, "displacementsMm");
  if (input.residualPressureMpa > input.initialPressureMpa)
    simpleError("residualPressureMpa", "Residual exceeds initial pressure.");
  return {
    requiredSupportPressuresMpa: input.displacementsMm.map((v) =>
      Math.max(
        input.residualPressureMpa,
        input.initialPressureMpa - input.unloadingStiffnessMpaPerMm * v,
      ),
    ),
    residualTransitionDisplacementMm:
      (input.initialPressureMpa - input.residualPressureMpa) /
      input.unloadingStiffnessMpaPerMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  displacementsMm: [0, 10, 20],
  initialPressureMpa: 2,
  unloadingStiffnessMpaPerMm: 0.1,
  residualPressureMpa: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredSupportPressuresMpa: [2, 1, 0.5],
  residualTransitionDisplacementMm: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ground-reaction-curve",
  title: "Ground Reaction Curve",
  description:
    "Evaluate calibrated linear-unloading ground reaction with a residual floor; not an elastoplastic solution or an uncalibrated prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredSupportPressuresMpa",
      label: "Required support pressures mpa",
      kind: "numberList",
    },
    {
      id: "residualTransitionDisplacementMm",
      label: "Residual transition displacement mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      displacementsMm: value.displacementsMm as readonly number[],
      initialPressureMpa: value.initialPressureMpa as number,
      unloadingStiffnessMpaPerMm: value.unloadingStiffnessMpaPerMm as number,
      residualPressureMpa: value.residualPressureMpa as number,
    }),
});
export const run = tool.execute;
export default tool;
