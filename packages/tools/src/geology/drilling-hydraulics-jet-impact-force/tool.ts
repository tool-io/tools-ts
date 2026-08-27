import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrillingHydraulicsJetImpactForceInput = {
  readonly dischargeCoefficient?: number;
  readonly flowRateCubicMetresPerSecond: number;
  readonly mudDensityKgPerCubicMetre: number;
  readonly nozzleCount: number;
  readonly nozzleDiameterMetres: number;
};

export type DrillingHydraulicsJetImpactForceOutput = {
  readonly jetImpactForceNewtons: number;
  readonly jetVelocityMetresPerSecond: number;
};

export const calculateDrillingHydraulicsJetImpactForce = (
  input: DrillingHydraulicsJetImpactForceInput,
): DrillingHydraulicsJetImpactForceOutput => {
  const discharge = input.dischargeCoefficient ?? 0.95;
  if (!(input.flowRateCubicMetresPerSecond > 0))
    return simpleError(
      "flowRateCubicMetresPerSecond",
      "Flow rate must be greater than zero.",
      "invalid_flow_rate",
    );
  if (!(input.mudDensityKgPerCubicMetre > 0))
    return simpleError(
      "mudDensityKgPerCubicMetre",
      "Mud density must be greater than zero.",
      "invalid_density",
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
  if (!(discharge > 0 && discharge <= 1))
    return simpleError(
      "dischargeCoefficient",
      "Discharge coefficient must lie between zero and one.",
      "invalid_discharge_coefficient",
    );
  const totalFlowArea =
    (input.nozzleCount *
      Math.PI *
      input.nozzleDiameterMetres *
      input.nozzleDiameterMetres) /
    4;
  const jetVelocityMetresPerSecond =
    input.flowRateCubicMetresPerSecond / (discharge * totalFlowArea);
  return {
    jetVelocityMetresPerSecond,
    jetImpactForceNewtons:
      input.mudDensityKgPerCubicMetre *
      input.flowRateCubicMetresPerSecond *
      jetVelocityMetresPerSecond,
  };
};

export const drillingHydraulicsJetImpactForceExample = {
  input: {
    flowRateCubicMetresPerSecond: 0.02,
    mudDensityKgPerCubicMetre: 1100,
    nozzleCount: 3,
    nozzleDiameterMetres: 0.0095,
  },
  output: {
    jetVelocityMetresPerSecond: 99.0029290749993,
    jetImpactForceNewtons: 2178.0644396499847,
  },
} satisfies ToolExample<
  DrillingHydraulicsJetImpactForceInput,
  DrillingHydraulicsJetImpactForceOutput
>;

export const drillingHydraulicsJetImpactForceTool = createSimpleTool({
  id: "geology/drilling-hydraulics-jet-impact-force",
  title: "Drilling Hydraulics Jet Impact Force Calculator",
  description:
    "Compute the jet impact force delivered by the bit nozzles from flow rate, mud density and nozzle geometry.",
  inputs: [
    {
      description: "Circulating flow rate in cubic metres per second.",
      id: "flowRateCubicMetresPerSecond",
      kind: "number",
      label: "Flow rate",
    },
    {
      description: "Mud density in kilograms per cubic metre.",
      id: "mudDensityKgPerCubicMetre",
      kind: "number",
      label: "Mud density",
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
    {
      default: 0.95,
      description: "Nozzle discharge (flow) coefficient.",
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge coefficient",
    },
  ],
  outputs: [
    {
      description:
        "Effective jet velocity at the nozzles in metres per second.",
      id: "jetVelocityMetresPerSecond",
      kind: "number",
      label: "Jet velocity",
    },
    {
      description: "Jet impact force in newtons.",
      id: "jetImpactForceNewtons",
      kind: "number",
      label: "Impact force",
    },
  ],
  calculate: (input) =>
    calculateDrillingHydraulicsJetImpactForce(
      input as unknown as DrillingHydraulicsJetImpactForceInput,
    ),
});

export const runDrillingHydraulicsJetImpactForce =
  drillingHydraulicsJetImpactForceTool.execute;
export default drillingHydraulicsJetImpactForceTool;
