import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrillingHydraulicsPressureLossInput = {
  readonly flowRateCubicMetresPerSecond: number;
  readonly pipeInternalDiameterMetres: number;
  readonly pipeLengthMetres: number;
  readonly plasticViscosityPascalSeconds: number;
  readonly yieldPointPascals: number;
};

export type DrillingHydraulicsPressureLossOutput = {
  readonly frictionalPressureLossPa: number;
  readonly velocityMetresPerSecond: number;
};

const LAMINAR_PIPE_COEFFICIENT = 16 / 3;

export const calculateDrillingHydraulicsPressureLoss = (
  input: DrillingHydraulicsPressureLossInput,
): DrillingHydraulicsPressureLossOutput => {
  if (!(input.flowRateCubicMetresPerSecond > 0))
    return simpleError(
      "flowRateCubicMetresPerSecond",
      "Flow rate must be greater than zero.",
      "invalid_flow_rate",
    );
  if (!(input.pipeInternalDiameterMetres > 0))
    return simpleError(
      "pipeInternalDiameterMetres",
      "Pipe internal diameter must be greater than zero.",
      "invalid_diameter",
    );
  if (!(input.pipeLengthMetres > 0))
    return simpleError(
      "pipeLengthMetres",
      "Pipe length must be greater than zero.",
      "invalid_length",
    );
  if (!(input.plasticViscosityPascalSeconds > 0))
    return simpleError(
      "plasticViscosityPascalSeconds",
      "Plastic viscosity must be greater than zero.",
      "invalid_viscosity",
    );
  if (!(input.yieldPointPascals >= 0))
    return simpleError(
      "yieldPointPascals",
      "Yield point cannot be negative.",
      "invalid_yield_point",
    );
  const velocityMetresPerSecond =
    (4 * input.flowRateCubicMetresPerSecond) /
    (Math.PI *
      input.pipeInternalDiameterMetres *
      input.pipeInternalDiameterMetres);
  const frictionalPressureLossPa =
    (32 *
      input.plasticViscosityPascalSeconds *
      velocityMetresPerSecond *
      input.pipeLengthMetres) /
      (input.pipeInternalDiameterMetres * input.pipeInternalDiameterMetres) +
    (LAMINAR_PIPE_COEFFICIENT *
      input.yieldPointPascals *
      input.pipeLengthMetres) /
      input.pipeInternalDiameterMetres;
  return { frictionalPressureLossPa, velocityMetresPerSecond };
};

export const drillingHydraulicsPressureLossExample = {
  input: {
    flowRateCubicMetresPerSecond: 0.02,
    pipeInternalDiameterMetres: 0.1,
    pipeLengthMetres: 1000,
    plasticViscosityPascalSeconds: 0.03,
    yieldPointPascals: 6,
  },
  output: {
    frictionalPressureLossPa: 564461.9925891511,
    velocityMetresPerSecond: 2.546479089470325,
  },
} satisfies ToolExample<
  DrillingHydraulicsPressureLossInput,
  DrillingHydraulicsPressureLossOutput
>;

export const drillingHydraulicsPressureLossTool = createSimpleTool({
  id: "geology/drilling-hydraulics-pressure-loss",
  title: "Drilling Hydraulics Pressure Loss Calculator",
  description:
    "Estimate laminar frictional pressure loss in drill pipe with the Bingham plastic pipe-flow equation.",
  inputs: [
    {
      description: "Circulating flow rate in cubic metres per second.",
      id: "flowRateCubicMetresPerSecond",
      kind: "number",
      label: "Flow rate",
    },
    {
      description: "Pipe internal diameter in metres.",
      id: "pipeInternalDiameterMetres",
      kind: "number",
      label: "Pipe ID",
    },
    {
      description: "Pipe length in metres.",
      id: "pipeLengthMetres",
      kind: "number",
      label: "Length",
    },
    {
      description: "Plastic viscosity in pascal seconds.",
      id: "plasticViscosityPascalSeconds",
      kind: "number",
      label: "Plastic viscosity",
    },
    {
      description: "Yield point in pascals.",
      id: "yieldPointPascals",
      kind: "number",
      label: "Yield point",
    },
  ],
  outputs: [
    {
      description: "Mean fluid velocity in metres per second.",
      id: "velocityMetresPerSecond",
      kind: "number",
      label: "Velocity",
    },
    {
      description: "Frictional pressure loss over the pipe length in pascals.",
      id: "frictionalPressureLossPa",
      kind: "number",
      label: "Pressure loss",
    },
  ],
  calculate: (input) =>
    calculateDrillingHydraulicsPressureLoss(
      input as unknown as DrillingHydraulicsPressureLossInput,
    ),
});

export const runDrillingHydraulicsPressureLoss =
  drillingHydraulicsPressureLossTool.execute;
export default drillingHydraulicsPressureLossTool;
