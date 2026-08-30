import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrificeFlowRateInput = Readonly<{
  readonly dischargeCoefficient: number;
  readonly areaSquareMeters: number;
  readonly pressureDifferencePascals: number;
  readonly densityKgPerM3: number;
}>;
export type OrificeFlowRateOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateOrificeFlowRate = (
  x: OrificeFlowRateInput,
): OrificeFlowRateOutput => {
  if (!Number.isFinite(x.dischargeCoefficient) || x.dischargeCoefficient < 0)
    simpleError("dischargeCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
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
  if (x.dischargeCoefficient > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flowCubicMetersPerSecond =
    x.dischargeCoefficient *
    x.areaSquareMeters *
    Math.sqrt((2 * x.pressureDifferencePascals) / x.densityKgPerM3);
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
    dischargeCoefficient: 0.62,
    areaSquareMeters: 0.01,
    pressureDifferencePascals: 10000,
    densityKgPerM3: 1000,
  },
  output: { flowCubicMetersPerSecond: 0.027727242920997392 },
} satisfies ToolExample<OrificeFlowRateInput, OrificeFlowRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/orifice-flow-rate",
  title: "Orifice Flow Rate",
  description:
    "Idealized incompressible orifice discharge Q=Cd A√(2Δp/ρ); Cd must be supplied for the actual geometry.",
  inputs: [
    {
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge Coefficient",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
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
    calculateOrificeFlowRate({
      dischargeCoefficient: input.dischargeCoefficient as number,
      areaSquareMeters: input.areaSquareMeters as number,
      pressureDifferencePascals: input.pressureDifferencePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
    }),
});
export const orificeFlowRateTool = tool;
export const runOrificeFlowRate = tool.execute;
export default tool;
