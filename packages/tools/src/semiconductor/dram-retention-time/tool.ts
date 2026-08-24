import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DramRetentionTimeInput = {
  readonly cellCapacitanceFemtoFarads: number;
  readonly leakageCurrentFemtoAmperes: number;
  readonly refreshVoltageDropVolts: number;
};

export type DramRetentionTimeOutput = {
  readonly retentionSeconds: number;
};

export const dramRetentionTimeExample = {
  input: {
    cellCapacitanceFemtoFarads: 25,
    leakageCurrentFemtoAmperes: 10,
    refreshVoltageDropVolts: 0.5,
  },
  output: { retentionSeconds: 1.25 },
} satisfies ToolExample<DramRetentionTimeInput, DramRetentionTimeOutput>;

export const calculateDramRetentionTime = (
  input: DramRetentionTimeInput,
): DramRetentionTimeOutput => {
  const cellCapacitanceFemtoFarads = input.cellCapacitanceFemtoFarads;
  const leakageCurrentFemtoAmperes = input.leakageCurrentFemtoAmperes;
  const refreshVoltageDropVolts = input.refreshVoltageDropVolts;

  if (
    !Number.isFinite(cellCapacitanceFemtoFarads) ||
    cellCapacitanceFemtoFarads <= 0
  )
    simpleError(
      "cellCapacitanceFemtoFarads",
      "Cell capacitance must be a finite positive number greater than 0 fF.",
      "invalid_capacitance",
    );
  if (!Number.isFinite(refreshVoltageDropVolts) || refreshVoltageDropVolts <= 0)
    simpleError(
      "refreshVoltageDropVolts",
      "Refresh voltage drop must be a finite positive number greater than 0 V.",
      "invalid_voltage",
    );
  if (
    !Number.isFinite(leakageCurrentFemtoAmperes) ||
    leakageCurrentFemtoAmperes <= 0
  )
    simpleError(
      "leakageCurrentFemtoAmperes",
      "Leakage current must be a finite positive number greater than 0 fA.",
      "invalid_leakage",
    );

  // 1e-15 cancels: t = C[fF]*ΔV / I[fA]; use direct ratio to preserve full precision and avoid intermediate underflow
  const logRetention =
    Math.log(cellCapacitanceFemtoFarads) +
    Math.log(refreshVoltageDropVolts) -
    Math.log(leakageCurrentFemtoAmperes);
  const directRetention =
    (cellCapacitanceFemtoFarads * refreshVoltageDropVolts) /
    leakageCurrentFemtoAmperes;
  const retentionSeconds =
    Number.isFinite(directRetention) && directRetention > 0
      ? directRetention
      : Math.exp(logRetention);
  if (!Number.isFinite(retentionSeconds) || retentionSeconds === 0)
    simpleError(
      "leakageCurrentFemtoAmperes",
      "Retention time is outside the representable positive range.",
      retentionSeconds === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    retentionSeconds: retentionSeconds === 0 ? 0 : retentionSeconds,
  };
};

export const dramRetentionTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: input.cellCapacitanceFemtoFarads as number,
      leakageCurrentFemtoAmperes: input.leakageCurrentFemtoAmperes as number,
      refreshVoltageDropVolts: input.refreshVoltageDropVolts as number,
    }),
  description:
    "Estimate DRAM retention time from cell capacitance, allowable refresh voltage drop, and leakage current. Formula: t_ret [s] = (C [fF]·1e-15·ΔV [V])/(I_leak [fA]·1e-15) = C·ΔV/I_leak, derived from charge Q=C·ΔV leaking at rate I_leak. Inputs: C>0 fF, ΔV>0 V, I_leak>0 fA. Output: t_ret>0 s. Assumes constant leakage, no refresh overhead, and that the cell holds charge C·V until droop ΔV.",
  id: "semiconductor/dram-retention-time",
  inputs: [
    {
      description: "Storage cell capacitance. Must be greater than 0 fF.",
      id: "cellCapacitanceFemtoFarads",
      kind: "number",
      label: "Cell capacitance",
      minimum: Number.MIN_VALUE,
      unit: "fF",
    },
    {
      description:
        "Voltage droop tolerated before refresh. Must be greater than 0 V.",
      id: "refreshVoltageDropVolts",
      kind: "number",
      label: "Refresh voltage drop",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      description: "Cell leakage current. Must be greater than 0 fA.",
      id: "leakageCurrentFemtoAmperes",
      kind: "number",
      label: "Leakage current",
      minimum: Number.MIN_VALUE,
      unit: "fA",
    },
  ],
  outputs: [
    {
      description:
        "Time until the stored level droops by the allowed drop. Greater than 0 s.",
      id: "retentionSeconds",
      kind: "number",
      label: "Retention time",
      minimum: Number.MIN_VALUE,
      unit: "s",
    },
  ],
  title: "DRAM Retention Time Calculator",
});
export const runDramRetentionTime = dramRetentionTimeTool.execute;
export default dramRetentionTimeTool;
