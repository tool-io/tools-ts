import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasSensorSensitivityInput = Readonly<{
  readonly firstConcentrationPpm: number;
  readonly secondConcentrationPpm: number;
  readonly firstOutputMv: number;
  readonly secondOutputMv: number;
}>;
export type GasSensorSensitivityOutput = Readonly<{
  readonly sensitivityMvPerPpm: number;
}>;

export const calculateGasSensorSensitivity = (
  x: GasSensorSensitivityInput,
): GasSensorSensitivityOutput => {
  if (!Number.isFinite(x.firstConcentrationPpm) || x.firstConcentrationPpm < 0)
    simpleError("firstConcentrationPpm", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.secondConcentrationPpm) ||
    x.secondConcentrationPpm < 0
  )
    simpleError(
      "secondConcentrationPpm",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.firstOutputMv))
    simpleError("firstOutputMv", "Provide a finite number.");
  if (!Number.isFinite(x.secondOutputMv))
    simpleError("secondOutputMv", "Provide a finite number.");
  if (!(x.secondConcentrationPpm > x.firstConcentrationPpm))
    simpleError(
      "secondConcentrationPpm",
      "Second concentration must exceed first.",
    );
  const sensitivityMvPerPpm =
    (x.secondOutputMv - x.firstOutputMv) /
    (x.secondConcentrationPpm - x.firstConcentrationPpm);
  if (!Number.isFinite(sensitivityMvPerPpm))
    simpleError("sensitivityMvPerPpm", "The inputs produce an invalid result.");
  return {
    sensitivityMvPerPpm: Object.is(sensitivityMvPerPpm, -0)
      ? 0
      : sensitivityMvPerPpm,
  };
};

export const example = {
  input: {
    firstConcentrationPpm: 100,
    secondConcentrationPpm: 200,
    firstOutputMv: 100,
    secondOutputMv: 300,
  },
  output: { sensitivityMvPerPpm: 2 },
} satisfies ToolExample<GasSensorSensitivityInput, GasSensorSensitivityOutput>;

export const tool = createSimpleTool({
  id: "electronics/gas-sensor-sensitivity",
  title: "Gas Sensor Sensitivity",
  description:
    "Calculate the signed slope of a two-point gas-sensor calibration in output signal per concentration unit.",
  inputs: [
    {
      id: "firstConcentrationPpm",
      kind: "number",
      label: "First concentration",
      unit: "ppm",
      minimum: 0,
    },
    {
      id: "secondConcentrationPpm",
      kind: "number",
      label: "Second concentration",
      unit: "ppm",
      minimum: 0,
    },
    {
      id: "firstOutputMv",
      kind: "number",
      label: "First sensor output",
      unit: "mV",
    },
    {
      id: "secondOutputMv",
      kind: "number",
      label: "Second sensor output",
      unit: "mV",
    },
  ],
  outputs: [
    {
      id: "sensitivityMvPerPpm",
      kind: "number",
      label: "Calibration slope",
      unit: "mV/ppm",
    },
  ],
  calculate: (input) =>
    calculateGasSensorSensitivity({
      firstConcentrationPpm: input.firstConcentrationPpm as number,
      secondConcentrationPpm: input.secondConcentrationPpm as number,
      firstOutputMv: input.firstOutputMv as number,
      secondOutputMv: input.secondOutputMv as number,
    }),
});
export const gasSensorSensitivityTool = tool;
export const runGasSensorSensitivity = tool.execute;
export default tool;
