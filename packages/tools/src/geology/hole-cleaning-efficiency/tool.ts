import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HoleCleaningEfficiencyInput = {
  readonly mudFlowRateCubicMetresPerSecond: number;
  readonly holeDiameterMetres: number;
  readonly pipeOuterDiameterMetres: number;
  readonly cuttingsSlipVelocityMetresPerSecond?: number;
};

export type HoleCleaningEfficiencyOutput = {
  readonly annularFlowAreaSquareMetres: number;
  readonly annularVelocityMetresPerSecond: number;
  readonly cuttingsTransportVelocityMetresPerSecond: number;
  readonly holeCleaningEfficiencyPercent: number;
};

export const calculateHoleCleaningEfficiency = (
  input: HoleCleaningEfficiencyInput,
): HoleCleaningEfficiencyOutput => {
  const slip = input.cuttingsSlipVelocityMetresPerSecond ?? 0;
  if (!(input.mudFlowRateCubicMetresPerSecond > 0))
    return simpleError(
      "mudFlowRateCubicMetresPerSecond",
      "Mud flow rate must be greater than zero.",
      "invalid_flow_rate",
    );
  if (!(input.pipeOuterDiameterMetres > 0))
    return simpleError(
      "pipeOuterDiameterMetres",
      "Pipe outer diameter must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.holeDiameterMetres > input.pipeOuterDiameterMetres))
    return simpleError(
      "holeDiameterMetres",
      "Hole diameter must be greater than the pipe outer diameter.",
      "invalid_geometry",
    );
  if (!(slip >= 0))
    return simpleError(
      "cuttingsSlipVelocityMetresPerSecond",
      "Cuttings slip velocity cannot be negative.",
      "invalid_slip_velocity",
    );
  const area =
    (Math.PI / 4) *
    (input.holeDiameterMetres ** 2 - input.pipeOuterDiameterMetres ** 2);
  const annularVelocity = input.mudFlowRateCubicMetresPerSecond / area;
  if (!(annularVelocity > slip))
    return simpleError(
      "cuttingsSlipVelocityMetresPerSecond",
      "Annular velocity must exceed the cuttings slip velocity for transport.",
      "invalid_slip_velocity",
    );
  const transportVelocity = annularVelocity - slip;
  return {
    annularFlowAreaSquareMetres: area,
    annularVelocityMetresPerSecond: annularVelocity,
    cuttingsTransportVelocityMetresPerSecond: transportVelocity,
    holeCleaningEfficiencyPercent: (transportVelocity / annularVelocity) * 100,
  };
};

export const holeCleaningEfficiencyExample = {
  input: {
    mudFlowRateCubicMetresPerSecond: 0.02,
    holeDiameterMetres: 0.31115,
    pipeOuterDiameterMetres: 0.127,
    cuttingsSlipVelocityMetresPerSecond: 0.1,
  },
  output: {
    annularFlowAreaSquareMetres: 0.0633701041046308,
    annularVelocityMetresPerSecond: 0.31560623550464534,
    cuttingsTransportVelocityMetresPerSecond: 0.21560623550464533,
    holeCleaningEfficiencyPercent: 68.3149479476846,
  },
} satisfies ToolExample<
  HoleCleaningEfficiencyInput,
  HoleCleaningEfficiencyOutput
>;

export const holeCleaningEfficiencyTool = createSimpleTool({
  id: "geology/hole-cleaning-efficiency",
  title: "Hole Cleaning Efficiency Calculator",
  description:
    "Compute the annular velocity, cuttings transport velocity and hole cleaning efficiency from circulation rate, well geometry and cuttings slip velocity.",
  inputs: [
    {
      description: "Mud flow rate in cubic metres per second.",
      id: "mudFlowRateCubicMetresPerSecond",
      kind: "number",
      label: "Mud flow rate",
    },
    {
      description: "Borehole (open-hole or casing ID) diameter in metres.",
      id: "holeDiameterMetres",
      kind: "number",
      label: "Hole diameter",
    },
    {
      description: "Drill pipe outer diameter in metres.",
      id: "pipeOuterDiameterMetres",
      kind: "number",
      label: "Pipe OD",
    },
    {
      default: 0,
      description: "Cuttings slip velocity in metres per second.",
      id: "cuttingsSlipVelocityMetresPerSecond",
      kind: "number",
      label: "Slip velocity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Annular flow area between hole and pipe in square metres.",
      id: "annularFlowAreaSquareMetres",
      kind: "number",
      label: "Flow area",
    },
    {
      description: "Mud velocity up the annulus in metres per second.",
      id: "annularVelocityMetresPerSecond",
      kind: "number",
      label: "Annular velocity",
    },
    {
      description:
        "Cuttings transport velocity (annular minus slip velocity) in metres per second.",
      id: "cuttingsTransportVelocityMetresPerSecond",
      kind: "number",
      label: "Transport velocity",
    },
    {
      description:
        "Transport ratio expressed as hole cleaning efficiency in percent.",
      id: "holeCleaningEfficiencyPercent",
      kind: "number",
      label: "Efficiency",
    },
  ],
  calculate: (input) =>
    calculateHoleCleaningEfficiency(
      input as unknown as HoleCleaningEfficiencyInput,
    ),
});

export const runHoleCleaningEfficiency = holeCleaningEfficiencyTool.execute;
export default holeCleaningEfficiencyTool;
