import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarCellEfficiencyInput = {
  readonly fillFactor: number;
  readonly incidentPowerDensityMwPerCm2?: number;
  readonly jscMAPerCm2: number;
  readonly openCircuitVoltageVolts: number;
};

export type SolarCellEfficiencyOutput = {
  readonly efficiencyPercent: number;
};

export const solarCellEfficiencyExample = {
  input: {
    fillFactor: 0.8,
    jscMAPerCm2: 25,
    openCircuitVoltageVolts: 0.6,
  },
  output: { efficiencyPercent: 12 },
} satisfies ToolExample<SolarCellEfficiencyInput, SolarCellEfficiencyOutput>;

export const solarCellEfficiencyTool = createSimpleTool({
  id: "semiconductor/solar-cell-efficiency",
  title: "Solar Cell Efficiency Calculator",
  description:
    "Compute solar cell power conversion efficiency from short-circuit current density, open-circuit voltage, fill factor, and incident power density.",
  inputs: [
    {
      description: "Short-circuit current density.",
      id: "jscMAPerCm2",
      kind: "number",
      label: "Short-circuit current density",
      unit: "mA/cm²",
    },
    {
      description: "Open-circuit voltage.",
      id: "openCircuitVoltageVolts",
      kind: "number",
      label: "Open-circuit voltage",
      unit: "V",
    },
    {
      description: "Fill factor between 0 and 1.",
      id: "fillFactor",
      kind: "number",
      label: "Fill factor",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 100,
      description:
        "Incident irradiance; the 100 mW/cm² default represents standard one-sun test irradiance.",
      id: "incidentPowerDensityMwPerCm2",
      kind: "number",
      label: "Incident power density",
      unit: "mW/cm²",
    },
  ],
  outputs: [
    {
      description: "Power conversion efficiency under one-sun illumination.",
      format: "percent",
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency",
    },
  ],
  calculate: (input) => {
    const jsc = input.jscMAPerCm2 as number;
    const voc = input.openCircuitVoltageVolts as number;
    const ff = input.fillFactor as number;
    const incidentPowerDensityMwPerCm2 =
      input.incidentPowerDensityMwPerCm2 as number;
    if (!(jsc > 0))
      simpleError(
        "jscMAPerCm2",
        "Short-circuit current density must be positive.",
        "invalid_jsc",
      );
    if (!(voc > 0))
      simpleError(
        "openCircuitVoltageVolts",
        "Open-circuit voltage must be positive.",
        "invalid_voc",
      );
    if (!(incidentPowerDensityMwPerCm2 > 0))
      simpleError(
        "incidentPowerDensityMwPerCm2",
        "Incident power density must be positive.",
        "invalid_incident_power",
      );
    const efficiencyPercent =
      (jsc / incidentPowerDensityMwPerCm2) * voc * ff * 100;
    if (!Number.isFinite(efficiencyPercent) || efficiencyPercent > 100)
      simpleError(
        "fillFactor",
        "The supplied measurements imply an efficiency outside 0–100%.",
        "invalid_efficiency",
      );
    return { efficiencyPercent };
  },
});
export const runSolarCellEfficiency = solarCellEfficiencyTool.execute;
export default solarCellEfficiencyTool;
