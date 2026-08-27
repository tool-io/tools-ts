import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrillingHydraulicsBitNozzleVelocityInput = {
  readonly flowRateCubicMetresPerSecond: number;
  readonly nozzleCount: number;
  readonly nozzleDiameterMetres: number;
};

export type DrillingHydraulicsBitNozzleVelocityOutput = {
  readonly nozzleVelocityMetresPerSecond: number;
  readonly totalFlowAreaSquareMetres: number;
};

export const calculateDrillingHydraulicsBitNozzleVelocity = (
  input: DrillingHydraulicsBitNozzleVelocityInput,
): DrillingHydraulicsBitNozzleVelocityOutput => {
  if (!(input.flowRateCubicMetresPerSecond > 0))
    return simpleError(
      "flowRateCubicMetresPerSecond",
      "Flow rate must be greater than zero.",
      "invalid_flow_rate",
    );
  if (!(input.nozzleCount >= 1))
    return simpleError(
      "nozzleCount",
      "There must be at least one nozzle.",
      "invalid_nozzle_count",
    );
  if (!(input.nozzleDiameterMetres > 0))
    return simpleError(
      "nozzleDiameterMetres",
      "Nozzle diameter must be greater than zero.",
      "invalid_diameter",
    );
  const totalFlowAreaSquareMetres =
    (input.nozzleCount *
      Math.PI *
      input.nozzleDiameterMetres *
      input.nozzleDiameterMetres) /
    4;
  return {
    totalFlowAreaSquareMetres,
    nozzleVelocityMetresPerSecond:
      input.flowRateCubicMetresPerSecond / totalFlowAreaSquareMetres,
  };
};

export const drillingHydraulicsBitNozzleVelocityExample = {
  input: {
    flowRateCubicMetresPerSecond: 0.02,
    nozzleCount: 3,
    nozzleDiameterMetres: 0.0095,
  },
  output: {
    totalFlowAreaSquareMetres: 0.0002126465527398591,
    nozzleVelocityMetresPerSecond: 94.05278262124934,
  },
} satisfies ToolExample<
  DrillingHydraulicsBitNozzleVelocityInput,
  DrillingHydraulicsBitNozzleVelocityOutput
>;

export const drillingHydraulicsBitNozzleVelocityTool = createSimpleTool({
  id: "geology/drilling-hydraulics-bit-nozzle-velocity",
  title: "Drilling Hydraulics Bit Nozzle Velocity Calculator",
  description:
    "Compute bit nozzle velocity and total flow area from circulation rate, nozzle count and nozzle diameter.",
  inputs: [
    {
      description: "Circulating flow rate in cubic metres per second.",
      id: "flowRateCubicMetresPerSecond",
      kind: "number",
      label: "Flow rate",
    },
    {
      description: "Number of open bit nozzles.",
      id: "nozzleCount",
      kind: "integer",
      label: "Nozzles",
      minimum: 1,
    },
    {
      description: "Individual nozzle diameter in metres.",
      id: "nozzleDiameterMetres",
      kind: "number",
      label: "Nozzle diameter",
    },
  ],
  outputs: [
    {
      description: "Combined area of all nozzles in square metres.",
      id: "totalFlowAreaSquareMetres",
      kind: "number",
      label: "Total flow area",
    },
    {
      description: "Jet velocity through the nozzles in metres per second.",
      id: "nozzleVelocityMetresPerSecond",
      kind: "number",
      label: "Nozzle velocity",
    },
  ],
  calculate: (input) =>
    calculateDrillingHydraulicsBitNozzleVelocity(
      input as unknown as DrillingHydraulicsBitNozzleVelocityInput,
    ),
});

export const runDrillingHydraulicsBitNozzleVelocity =
  drillingHydraulicsBitNozzleVelocityTool.execute;
export default drillingHydraulicsBitNozzleVelocityTool;
