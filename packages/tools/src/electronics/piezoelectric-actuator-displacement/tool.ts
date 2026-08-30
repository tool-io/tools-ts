import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PiezoelectricActuatorDisplacementInput = Readonly<{
  readonly d33MetersPerVolt: number;
  readonly voltageVolts: number;
  readonly activeLayers: number;
}>;
export type PiezoelectricActuatorDisplacementOutput = Readonly<{
  readonly displacementMeters: number;
}>;

export const calculatePiezoelectricActuatorDisplacement = (
  x: PiezoelectricActuatorDisplacementInput,
): PiezoelectricActuatorDisplacementOutput => {
  if (!Number.isFinite(x.d33MetersPerVolt) || x.d33MetersPerVolt < 0)
    simpleError("d33MetersPerVolt", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.voltageVolts) || x.voltageVolts < 0)
    simpleError("voltageVolts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.activeLayers) ||
    !Number.isSafeInteger(x.activeLayers) ||
    x.activeLayers < 0
  )
    simpleError("activeLayers", "Provide a safe integer at least 0.");
  const displacementMeters =
    x.d33MetersPerVolt * x.voltageVolts * x.activeLayers;
  if (!Number.isFinite(displacementMeters))
    simpleError(
      "displacementMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    displacementMeters: Object.is(displacementMeters, -0)
      ? 0
      : displacementMeters,
  };
};

export const example = {
  input: { d33MetersPerVolt: 4e-10, voltageVolts: 100, activeLayers: 100 },
  output: { displacementMeters: 0.000004 },
} satisfies ToolExample<
  PiezoelectricActuatorDisplacementInput,
  PiezoelectricActuatorDisplacementOutput
>;

export const tool = createSimpleTool({
  id: "electronics/piezoelectric-actuator-displacement",
  title: "Piezoelectric Actuator Displacement",
  description:
    "Ideal unloaded piezo stack displacement from effective d33 coefficient, drive voltage and number of active layers.",
  inputs: [
    {
      id: "d33MetersPerVolt",
      kind: "number",
      label: "D33 Meters Per Volt",
      unit: "m/V",
      minimum: 0,
    },
    {
      id: "voltageVolts",
      kind: "number",
      label: "Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    { id: "activeLayers", kind: "integer", label: "Active Layers", minimum: 0 },
  ],
  outputs: [
    {
      id: "displacementMeters",
      kind: "number",
      label: "Displacement Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculatePiezoelectricActuatorDisplacement({
      d33MetersPerVolt: input.d33MetersPerVolt as number,
      voltageVolts: input.voltageVolts as number,
      activeLayers: input.activeLayers as number,
    }),
});
export const piezoelectricActuatorDisplacementTool = tool;
export const runPiezoelectricActuatorDisplacement = tool.execute;
export default tool;
