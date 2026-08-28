import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntegratorRampVoltageInput = {
  readonly vinVolts: number;
  readonly timeSeconds: number;
  readonly rOhms: number;
  readonly cFarads: number;
};

export type IntegratorRampVoltageOutput = {
  readonly rampVoltageV: number;
};

export const integratorRampVoltageExample = {
  input: { vinVolts: 2, timeSeconds: 0.01, rOhms: 1000, cFarads: 0.0001 },
  output: { rampVoltageV: -0.19999999999999998 },
} satisfies ToolExample<
  IntegratorRampVoltageInput,
  IntegratorRampVoltageOutput
>;

export const calculateIntegratorRampVoltage = (
  input: IntegratorRampVoltageInput,
): IntegratorRampVoltageOutput => {
  if (!(input.timeSeconds > 0))
    simpleError(
      "timeSeconds",
      "Time interval must be positive.",
      "invalid_time_seconds",
    );
  if (!(input.rOhms > 0))
    simpleError("rOhms", "Resistance must be positive.", "invalid_r_ohms");
  if (!(input.cFarads > 0))
    simpleError("cFarads", "Capacitance must be positive.", "invalid_c_farads");
  return {
    rampVoltageV:
      -(input.vinVolts * input.timeSeconds) / (input.rOhms * input.cFarads),
  };
};

export const integratorRampVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateIntegratorRampVoltage(
      input as unknown as IntegratorRampVoltageInput,
    ),
  description:
    "Compute the op-amp integrator ramp voltage after a time interval as -(Vin x t) / (R x C).",
  id: "electronics/integrator-ramp-voltage",
  inputs: [
    { id: "vinVolts", kind: "number", label: "Input voltage", unit: "V" },
    { id: "timeSeconds", kind: "number", label: "Time interval", unit: "s" },
    { id: "rOhms", kind: "number", label: "Resistance", unit: "Ω" },
    { id: "cFarads", kind: "number", label: "Capacitance", unit: "F" },
  ],
  outputs: [
    { id: "rampVoltageV", kind: "number", label: "Ramp voltage", unit: "V" },
  ],
  title: "Integrator Ramp",
});
export const runIntegratorRampVoltage = integratorRampVoltageTool.execute;
export default integratorRampVoltageTool;
