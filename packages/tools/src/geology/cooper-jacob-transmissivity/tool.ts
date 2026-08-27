import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CooperJacobTransmissivityInput = {
  readonly dischargeM3PerDay: number;
  readonly drawdownPerLogCycleM: number;
};

export type CooperJacobTransmissivityOutput = {
  readonly transmissivityM2PerDay: number;
};

export const calculateCooperJacobTransmissivity = (
  input: CooperJacobTransmissivityInput,
): CooperJacobTransmissivityOutput => {
  if (!(input.dischargeM3PerDay > 0))
    simpleError(
      "dischargeM3PerDay",
      "Pumping discharge must be greater than zero.",
      "invalid_discharge",
    );
  if (!(input.drawdownPerLogCycleM > 0))
    simpleError(
      "drawdownPerLogCycleM",
      "Drawdown per log cycle must be greater than zero.",
      "invalid_drawdown",
    );
  return {
    transmissivityM2PerDay:
      (2.302585092994046 * input.dischargeM3PerDay) /
      (4 * Math.PI * input.drawdownPerLogCycleM),
  };
};

export const cooperJacobTransmissivityExample = {
  input: { dischargeM3PerDay: 1000, drawdownPerLogCycleM: 0.9 },
  output: { transmissivityM2PerDay: 203.59322191095217 },
} satisfies ToolExample<
  CooperJacobTransmissivityInput,
  CooperJacobTransmissivityOutput
>;

export const cooperJacobTransmissivityTool = createSimpleTool({
  id: "geology/cooper-jacob-transmissivity",
  title: "Cooper Jacob Transmissivity Calculator",
  description:
    "Compute aquifer transmissivity in square meters per day from constant discharge in cubic meters per day and the semilog drawdown change per log cycle of time in meters.",
  inputs: [
    {
      description: "Constant pumping discharge in cubic meters per day.",
      id: "dischargeM3PerDay",
      kind: "number",
      label: "Q",
    },
    {
      description: "Drawdown change per log cycle of time in meters.",
      id: "drawdownPerLogCycleM",
      kind: "number",
      label: "Delta s",
    },
  ],
  outputs: [
    {
      description: "Transmissivity in square meters per day.",
      id: "transmissivityM2PerDay",
      kind: "number",
      label: "T",
    },
  ],
  calculate: (input) =>
    calculateCooperJacobTransmissivity(
      input as unknown as CooperJacobTransmissivityInput,
    ),
});

export const runCooperJacobTransmissivity =
  cooperJacobTransmissivityTool.execute;
export default cooperJacobTransmissivityTool;
