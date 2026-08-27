import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiodeCurrentInput = {
  readonly nIdeality?: number;
  readonly saturationCurrentA: number;
  readonly thermalVoltageVolts: number;
  readonly vForwardVolts: number;
};

export type DiodeCurrentOutput = {
  readonly diodeCurrentA: number;
};

export const diodeCurrentExample = {
  input: {
    saturationCurrentA: 1e-12,
    thermalVoltageVolts: 0.025852,
    vForwardVolts: 0.7,
  },
  output: { diodeCurrentA: 0.5747544405391669 },
} satisfies ToolExample<DiodeCurrentInput, DiodeCurrentOutput>;

export const calculateDiodeCurrent = (
  input: DiodeCurrentInput,
): DiodeCurrentOutput => {
  if (!(input.saturationCurrentA > 0))
    simpleError(
      "saturationCurrentA",
      "Saturation current must be positive.",
      "invalid_saturation_current",
    );
  if (!(input.thermalVoltageVolts > 0))
    simpleError(
      "thermalVoltageVolts",
      "Thermal voltage must be positive.",
      "invalid_thermal_voltage",
    );
  const nIdeality = input.nIdeality ?? 1;
  return {
    diodeCurrentA:
      input.saturationCurrentA *
      (Math.exp(input.vForwardVolts / (nIdeality * input.thermalVoltageVolts)) -
        1),
  };
};

export const diodeCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeCurrent(input as unknown as DiodeCurrentInput),
  description: "Calculate Shockley diode current.",
  id: "electronics/diode-current",
  inputs: [
    {
      id: "saturationCurrentA",
      kind: "number",
      label: "Saturation current",
      unit: "A",
    },
    {
      id: "vForwardVolts",
      kind: "number",
      label: "Forward voltage",
      unit: "V",
    },
    {
      id: "thermalVoltageVolts",
      kind: "number",
      label: "Thermal voltage",
      unit: "V",
    },
    {
      default: 1,
      id: "nIdeality",
      kind: "number",
      label: "Ideality factor",
    },
  ],
  outputs: [
    { id: "diodeCurrentA", kind: "number", label: "Diode current", unit: "A" },
  ],
  title: "Shockley Diode Current",
});
export const runDiodeCurrent = diodeCurrentTool.execute;
export default diodeCurrentTool;
