import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoltageDropSinglePhaseInput = Readonly<{
  readonly currentAmperes: number;
  readonly lengthMeters: number;
  readonly resistanceOhmsPerMeter: number;
}>;
export type VoltageDropSinglePhaseOutput = Readonly<{
  readonly voltageDropVolts: number;
}>;

export const calculateVoltageDropSinglePhase = (
  x: VoltageDropSinglePhaseInput,
): VoltageDropSinglePhaseOutput => {
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.resistanceOhmsPerMeter) ||
    x.resistanceOhmsPerMeter < 0
  )
    simpleError(
      "resistanceOhmsPerMeter",
      "Provide a finite number at least 0.",
    );
  const voltageDropVolts =
    2 * x.currentAmperes * x.lengthMeters * x.resistanceOhmsPerMeter;
  if (!Number.isFinite(voltageDropVolts))
    simpleError(
      "voltageDropVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    voltageDropVolts: Object.is(voltageDropVolts, -0) ? 0 : voltageDropVolts,
  };
};

export const example = {
  input: {
    currentAmperes: 10,
    lengthMeters: 20,
    resistanceOhmsPerMeter: 0.005,
  },
  output: { voltageDropVolts: 2 },
} satisfies ToolExample<
  VoltageDropSinglePhaseInput,
  VoltageDropSinglePhaseOutput
>;

export const tool = createSimpleTool({
  id: "engineering/voltage-drop-single-phase",
  title: "Voltage Drop Single Phase",
  description:
    "Resistive single-phase two-wire voltage drop 2IRL using one-way conductor length and resistance per meter; ignores reactance.",
  inputs: [
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "resistanceOhmsPerMeter",
      kind: "number",
      label: "Resistance Ohms Per Meter",
      unit: "Ω/m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "voltageDropVolts",
      kind: "number",
      label: "Voltage Drop Volts",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateVoltageDropSinglePhase({
      currentAmperes: input.currentAmperes as number,
      lengthMeters: input.lengthMeters as number,
      resistanceOhmsPerMeter: input.resistanceOhmsPerMeter as number,
    }),
});
export const voltageDropSinglePhaseTool = tool;
export const runVoltageDropSinglePhase = tool.execute;
export default tool;
