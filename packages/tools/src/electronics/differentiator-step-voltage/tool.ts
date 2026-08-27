import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DifferentiatorStepVoltageInput = {
  readonly vinStepVolts: number;
  readonly rOhms: number;
  readonly cFarads: number;
  readonly stepTimeSeconds: number;
};

export type DifferentiatorStepVoltageOutput = {
  readonly differentiatorPeakV: number;
};

export const differentiatorStepVoltageExample = {
  input: {
    vinStepVolts: 5,
    rOhms: 1000,
    cFarads: 0.000001,
    stepTimeSeconds: 0.001,
  },
  output: { differentiatorPeakV: -2.5 },
} satisfies ToolExample<
  DifferentiatorStepVoltageInput,
  DifferentiatorStepVoltageOutput
>;

export const calculateDifferentiatorStepVoltage = (
  input: DifferentiatorStepVoltageInput,
): DifferentiatorStepVoltageOutput => {
  if (!(input.rOhms > 0))
    simpleError("rOhms", "Resistance must be positive.", "invalid_r_ohms");
  if (!(input.cFarads > 0))
    simpleError("cFarads", "Capacitance must be positive.", "invalid_c_farads");
  if (!(input.stepTimeSeconds > 0))
    simpleError(
      "stepTimeSeconds",
      "Step time must be positive.",
      "invalid_step_time_seconds",
    );
  const tauSeconds = input.rOhms * input.cFarads;
  return {
    differentiatorPeakV:
      -input.vinStepVolts * (tauSeconds / (tauSeconds + input.stepTimeSeconds)),
  };
};

export const differentiatorStepVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateDifferentiatorStepVoltage(
      input as unknown as DifferentiatorStepVoltageInput,
    ),
  description:
    "Compute the practical RC differentiator step peak as -Vin x tau / (tau + t_step), where the theoretical ideal peak is unbounded for an instantaneous step.",
  id: "electronics/differentiator-step-voltage",
  inputs: [
    {
      id: "vinStepVolts",
      kind: "number",
      label: "Input step voltage",
      unit: "V",
    },
    { id: "rOhms", kind: "number", label: "Resistance", unit: "Ω" },
    { id: "cFarads", kind: "number", label: "Capacitance", unit: "F" },
    { id: "stepTimeSeconds", kind: "number", label: "Step time", unit: "s" },
  ],
  outputs: [
    {
      id: "differentiatorPeakV",
      kind: "number",
      label: "Differentiator peak",
      unit: "V",
    },
  ],
  title: "Differentiator Step Peak",
});
export const runDifferentiatorStepVoltage =
  differentiatorStepVoltageTool.execute;
export default differentiatorStepVoltageTool;
