import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PiezoelectricSensorSensitivityInput = Readonly<{
  readonly chargeCoulombs: number;
  readonly forceNewtons: number;
}>;
export type PiezoelectricSensorSensitivityOutput = Readonly<{
  readonly coulombsPerNewton: number;
}>;

export const calculatePiezoelectricSensorSensitivity = (
  x: PiezoelectricSensorSensitivityInput,
): PiezoelectricSensorSensitivityOutput => {
  if (!Number.isFinite(x.chargeCoulombs) || x.chargeCoulombs < 0)
    simpleError("chargeCoulombs", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.forceNewtons) || x.forceNewtons < 0)
    simpleError("forceNewtons", "Provide a finite number at least 0.");
  const coulombsPerNewton = x.chargeCoulombs / x.forceNewtons;
  if (!Number.isFinite(coulombsPerNewton))
    simpleError(
      "coulombsPerNewton",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    coulombsPerNewton: Object.is(coulombsPerNewton, -0) ? 0 : coulombsPerNewton,
  };
};

export const example = {
  input: { chargeCoulombs: 1e-9, forceNewtons: 10 },
  output: { coulombsPerNewton: 1e-10 },
} satisfies ToolExample<
  PiezoelectricSensorSensitivityInput,
  PiezoelectricSensorSensitivityOutput
>;

export const tool = createSimpleTool({
  id: "electronics/piezoelectric-sensor-sensitivity",
  title: "Piezoelectric Sensor Sensitivity",
  description:
    "Charge sensitivity of a piezoelectric sensor from generated charge and applied force.",
  inputs: [
    {
      id: "chargeCoulombs",
      kind: "number",
      label: "Charge Coulombs",
      unit: "C",
      minimum: 0,
    },
    {
      id: "forceNewtons",
      kind: "number",
      label: "Force Newtons",
      unit: "N",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coulombsPerNewton",
      kind: "number",
      label: "Coulombs Per Newton",
      unit: "C/N",
    },
  ],
  calculate: (input) =>
    calculatePiezoelectricSensorSensitivity({
      chargeCoulombs: input.chargeCoulombs as number,
      forceNewtons: input.forceNewtons as number,
    }),
});
export const piezoelectricSensorSensitivityTool = tool;
export const runPiezoelectricSensorSensitivity = tool.execute;
export default tool;
