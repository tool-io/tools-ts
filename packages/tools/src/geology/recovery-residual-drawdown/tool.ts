import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RecoveryResidualDrawdownInput = {
  readonly dischargeM3PerDay: number;
  readonly transmissivityM2PerDay: number;
  readonly pumpingDurationDays: number;
  readonly recoveryElapsedDays: number;
};

export type RecoveryResidualDrawdownOutput = {
  readonly residualDrawdownM: number;
};

export const calculateRecoveryResidualDrawdown = (
  input: RecoveryResidualDrawdownInput,
): RecoveryResidualDrawdownOutput => {
  if (!(input.dischargeM3PerDay > 0))
    simpleError(
      "dischargeM3PerDay",
      "Pumping discharge must be greater than zero.",
      "invalid_discharge",
    );
  if (!(input.transmissivityM2PerDay > 0))
    simpleError(
      "transmissivityM2PerDay",
      "Transmissivity must be greater than zero.",
      "invalid_transmissivity",
    );
  if (!(input.pumpingDurationDays > 0))
    simpleError(
      "pumpingDurationDays",
      "Pumping duration must be greater than zero.",
      "invalid_duration",
    );
  if (!(input.recoveryElapsedDays > 0))
    simpleError(
      "recoveryElapsedDays",
      "Recovery elapsed time must be greater than zero.",
      "invalid_time",
    );
  return {
    residualDrawdownM:
      (input.dischargeM3PerDay / (4 * Math.PI * input.transmissivityM2PerDay)) *
      Math.log(input.pumpingDurationDays / input.recoveryElapsedDays),
  };
};

export const recoveryResidualDrawdownExample = {
  input: {
    dischargeM3PerDay: 800,
    transmissivityM2PerDay: 150,
    pumpingDurationDays: 1,
    recoveryElapsedDays: 0.25,
  },
  output: { residualDrawdownM: 0.588361600407071 },
} satisfies ToolExample<
  RecoveryResidualDrawdownInput,
  RecoveryResidualDrawdownOutput
>;

export const recoveryResidualDrawdownTool = createSimpleTool({
  id: "geology/recovery-residual-drawdown",
  title: "Recovery Residual Drawdown Calculator",
  description:
    "Compute Theis recovery residual drawdown in meters as Q / (4 pi T) times the natural log of pumping duration over time since recovery began (days).",
  inputs: [
    {
      description: "Constant pumping discharge in cubic meters per day.",
      id: "dischargeM3PerDay",
      kind: "number",
      label: "Q",
    },
    {
      description: "Transmissivity in square meters per day.",
      id: "transmissivityM2PerDay",
      kind: "number",
      label: "T",
    },
    {
      description: "Duration of pumping in days before shutdown.",
      id: "pumpingDurationDays",
      kind: "number",
      label: "t",
    },
    {
      description: "Time since pumping stopped in days.",
      id: "recoveryElapsedDays",
      kind: "number",
      label: "t'",
    },
  ],
  outputs: [
    {
      description: "Residual drawdown in meters.",
      id: "residualDrawdownM",
      kind: "number",
      label: "s'",
    },
  ],
  calculate: (input) =>
    calculateRecoveryResidualDrawdown(
      input as unknown as RecoveryResidualDrawdownInput,
    ),
});

export const runRecoveryResidualDrawdown = recoveryResidualDrawdownTool.execute;
export default recoveryResidualDrawdownTool;
