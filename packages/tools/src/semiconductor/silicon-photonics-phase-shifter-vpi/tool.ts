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
  readonly observedPhaseShifterVoltages: readonly number[];
  readonly observedUnwrappedPhaseRadians: readonly number[];
  readonly observedInteractionLengthM: number;
}>;
export type Output = Readonly<{
  readonly extractedLinearVpiVolts: number;
  readonly extractedVpiLengthVoltMeters: number;
  readonly phaseFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedPhaseShifterVoltages",
    label: "Observed phase shifter voltages",
    kind: "numberList",
  },
  {
    id: "observedUnwrappedPhaseRadians",
    label: "Observed unwrapped phase radians",
    kind: "numberList",
  },
  {
    id: "observedInteractionLengthM",
    label: "Observed interaction length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedInteractionLengthM, "observedInteractionLengthM");
  const fit = linearFit(
    input.observedPhaseShifterVoltages,
    input.observedUnwrappedPhaseRadians,
  );
  if (fit.slope === 0)
    simpleError(
      "phase",
      "Nonzero independently unwrapped phase slope required.",
    );
  const v = Math.PI / Math.abs(fit.slope);
  return {
    extractedLinearVpiVolts: v,
    extractedVpiLengthVoltMeters: v * input.observedInteractionLengthM,
    phaseFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhaseShifterVoltages: [0, 1, 2],
  observedUnwrappedPhaseRadians: [0, 1.5707963267948966, 3.141592653589793],
  observedInteractionLengthM: 0.01,
} satisfies Input;
export const exampleOutput = {
  extractedLinearVpiVolts: 2,
  extractedVpiLengthVoltMeters: 0.02,
  phaseFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-phase-shifter-vpi",
  title: "Semiconductor Silicon Photonics Phase Shifter Vpi Calculator",
  description:
    "Extract actual unwrapped silicon phase-shifter Vpi and VpiL from multi-point voltage/phase, not forward voltage×length product or fabricated electro-optic coefficient.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedLinearVpiVolts",
      label: "Extracted linear vpi volts",
      kind: "number",
    },
    {
      id: "extractedVpiLengthVoltMeters",
      label: "Extracted vpi length volt meters",
      kind: "number",
    },
    { id: "phaseFitRSquared", label: "Phase fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPhaseShifterVoltages:
        value.observedPhaseShifterVoltages as readonly number[],
      observedUnwrappedPhaseRadians:
        value.observedUnwrappedPhaseRadians as readonly number[],
      observedInteractionLengthM: value.observedInteractionLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
