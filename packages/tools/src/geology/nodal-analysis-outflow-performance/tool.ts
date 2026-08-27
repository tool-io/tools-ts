import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const GRAVITY_METRES_PER_SECOND_SQUARED = 9.80665;
const SECONDS_PER_DAY = 86400;

export type NodalAnalysisOutflowPerformanceInput = {
  readonly wellheadPressureMegapascals: number;
  readonly tubingLengthMetres: number;
  readonly tubingInnerDiameterMetres: number;
  readonly liquidRateCubicMetresPerDay: number;
  readonly fluidDensityKilogramsPerCubicMetre: number;
  readonly frictionFactor?: number;
};

export type NodalAnalysisOutflowPerformanceOutput = {
  readonly fluidVelocityMetresPerSecond: number;
  readonly hydrostaticPressureDropMegapascals: number;
  readonly frictionPressureDropMegapascals: number;
  readonly requiredBottomholePressureMegapascals: number;
};

export const calculateNodalAnalysisOutflowPerformance = (
  input: NodalAnalysisOutflowPerformanceInput,
): NodalAnalysisOutflowPerformanceOutput => {
  const frictionFactor = input.frictionFactor ?? 0.02;
  if (!(input.wellheadPressureMegapascals >= 0))
    return simpleError(
      "wellheadPressureMegapascals",
      "Wellhead pressure cannot be negative.",
      "invalid_pressure",
    );
  if (!(input.tubingLengthMetres > 0))
    return simpleError(
      "tubingLengthMetres",
      "Tubing length must be greater than zero.",
      "invalid_length",
    );
  if (!(input.tubingInnerDiameterMetres > 0))
    return simpleError(
      "tubingInnerDiameterMetres",
      "Tubing inner diameter must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.liquidRateCubicMetresPerDay > 0))
    return simpleError(
      "liquidRateCubicMetresPerDay",
      "Liquid rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(input.fluidDensityKilogramsPerCubicMetre > 0))
    return simpleError(
      "fluidDensityKilogramsPerCubicMetre",
      "Fluid density must be greater than zero.",
      "invalid_density",
    );
  if (!(frictionFactor > 0))
    return simpleError(
      "frictionFactor",
      "Friction factor must be greater than zero.",
      "invalid_friction",
    );
  const area = (Math.PI / 4) * input.tubingInnerDiameterMetres ** 2;
  const velocity = input.liquidRateCubicMetresPerDay / SECONDS_PER_DAY / area;
  const hydrostatic =
    (input.fluidDensityKilogramsPerCubicMetre *
      GRAVITY_METRES_PER_SECOND_SQUARED *
      input.tubingLengthMetres) /
    1e6;
  const friction =
    (frictionFactor *
      (input.tubingLengthMetres / input.tubingInnerDiameterMetres) *
      ((input.fluidDensityKilogramsPerCubicMetre * velocity * velocity) / 2)) /
    1e6;
  return {
    fluidVelocityMetresPerSecond: velocity,
    hydrostaticPressureDropMegapascals: hydrostatic,
    frictionPressureDropMegapascals: friction,
    requiredBottomholePressureMegapascals:
      input.wellheadPressureMegapascals + hydrostatic + friction,
  };
};

export const nodalAnalysisOutflowPerformanceExample = {
  input: {
    wellheadPressureMegapascals: 3.5,
    tubingLengthMetres: 2500,
    tubingInnerDiameterMetres: 0.0759,
    liquidRateCubicMetresPerDay: 800,
    fluidDensityKilogramsPerCubicMetre: 850,
    frictionFactor: 0.02,
  },
  output: {
    fluidVelocityMetresPerSecond: 2.0464578841940804,
    hydrostaticPressureDropMegapascals: 20.83913125,
    frictionPressureDropMegapascals: 1.1725268086340896,
    requiredBottomholePressureMegapascals: 25.51165805863409,
  },
} satisfies ToolExample<
  NodalAnalysisOutflowPerformanceInput,
  NodalAnalysisOutflowPerformanceOutput
>;

export const nodalAnalysisOutflowPerformanceTool = createSimpleTool({
  id: "geology/nodal-analysis-outflow-performance",
  title: "Nodal Analysis Outflow Performance Calculator",
  description:
    "Compute the single-phase outflow (tubing intake) bottom-hole pressure required to lift a given liquid rate against wellhead pressure, hydrostatic head and Darcy-Weisbach friction.",
  inputs: [
    {
      description: "Wellhead pressure in megapascals.",
      id: "wellheadPressureMegapascals",
      kind: "number",
      label: "WHFP",
    },
    {
      description: "Tubing length along the flow path in metres.",
      id: "tubingLengthMetres",
      kind: "number",
      label: "Tubing length",
    },
    {
      description: "Tubing inner diameter in metres.",
      id: "tubingInnerDiameterMetres",
      kind: "number",
      label: "Tubing ID",
    },
    {
      description: "Liquid flow rate in cubic metres per day.",
      id: "liquidRateCubicMetresPerDay",
      kind: "number",
      label: "Liquid rate",
    },
    {
      description: "Fluid density in kilograms per cubic metre.",
      id: "fluidDensityKilogramsPerCubicMetre",
      kind: "number",
      label: "Fluid density",
    },
    {
      default: 0.02,
      description: "Darcy-Weisbach friction factor.",
      id: "frictionFactor",
      kind: "number",
      label: "Friction factor",
    },
  ],
  outputs: [
    {
      description: "Mean fluid velocity in the tubing in metres per second.",
      id: "fluidVelocityMetresPerSecond",
      kind: "number",
      label: "Velocity",
    },
    {
      description: "Hydrostatic pressure drop in megapascals.",
      id: "hydrostaticPressureDropMegapascals",
      kind: "number",
      label: "Hydrostatic",
    },
    {
      description: "Frictional pressure drop in megapascals.",
      id: "frictionPressureDropMegapascals",
      kind: "number",
      label: "Friction",
    },
    {
      description:
        "Required bottom-hole pressure on the outflow curve in megapascals.",
      id: "requiredBottomholePressureMegapascals",
      kind: "number",
      label: "Required BHP",
    },
  ],
  calculate: (input) =>
    calculateNodalAnalysisOutflowPerformance(
      input as unknown as NodalAnalysisOutflowPerformanceInput,
    ),
});

export const runNodalAnalysisOutflowPerformance =
  nodalAnalysisOutflowPerformanceTool.execute;
export default nodalAnalysisOutflowPerformanceTool;
