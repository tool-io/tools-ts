import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VenturiFlowRateInput = Readonly<{
  readonly inletAreaSquareMeters: number;
  readonly throatAreaSquareMeters: number;
  readonly pressureDifferencePascals: number;
  readonly densityKgPerM3: number;
  readonly dischargeCoefficient: number;
}>;
export type VenturiFlowRateOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateVenturiFlowRate = (
  x: VenturiFlowRateInput,
): VenturiFlowRateOutput => {
  if (!Number.isFinite(x.inletAreaSquareMeters) || x.inletAreaSquareMeters < 0)
    simpleError("inletAreaSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.throatAreaSquareMeters) ||
    x.throatAreaSquareMeters < 0
  )
    simpleError(
      "throatAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.pressureDifferencePascals) ||
    x.pressureDifferencePascals < 0
  )
    simpleError(
      "pressureDifferencePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dischargeCoefficient) || x.dischargeCoefficient < 0)
    simpleError("dischargeCoefficient", "Provide a finite number at least 0.");
  if (
    x.throatAreaSquareMeters >= x.inletAreaSquareMeters ||
    x.dischargeCoefficient > 1
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flowCubicMetersPerSecond =
    x.dischargeCoefficient *
    x.throatAreaSquareMeters *
    Math.sqrt(
      (2 * x.pressureDifferencePascals) /
        (x.densityKgPerM3 *
          (1 - (x.throatAreaSquareMeters / x.inletAreaSquareMeters) ** 2)),
    );
  if (!Number.isFinite(flowCubicMetersPerSecond))
    simpleError(
      "flowCubicMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    flowCubicMetersPerSecond: Object.is(flowCubicMetersPerSecond, -0)
      ? 0
      : flowCubicMetersPerSecond,
  };
};

export const example = {
  input: {
    inletAreaSquareMeters: 0.02,
    throatAreaSquareMeters: 0.01,
    pressureDifferencePascals: 10000,
    densityKgPerM3: 1000,
    dischargeCoefficient: 0.98,
  },
  output: { flowCubicMetersPerSecond: 0.050606982390443575 },
} satisfies ToolExample<VenturiFlowRateInput, VenturiFlowRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/venturi-flow-rate",
  title: "Venturi Flow Rate",
  description:
    "Incompressible Venturi flow from inlet and throat area, pressure difference and discharge coefficient; requires throat smaller than inlet.",
  inputs: [
    {
      id: "inletAreaSquareMeters",
      kind: "number",
      label: "Inlet Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "throatAreaSquareMeters",
      kind: "number",
      label: "Throat Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "pressureDifferencePascals",
      kind: "number",
      label: "Pressure Difference Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
    },
  ],
  calculate: (input) =>
    calculateVenturiFlowRate({
      inletAreaSquareMeters: input.inletAreaSquareMeters as number,
      throatAreaSquareMeters: input.throatAreaSquareMeters as number,
      pressureDifferencePascals: input.pressureDifferencePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      dischargeCoefficient: input.dischargeCoefficient as number,
    }),
});
export const venturiFlowRateTool = tool;
export const runVenturiFlowRate = tool.execute;
export default tool;
