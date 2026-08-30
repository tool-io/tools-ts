import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrificeDischargeCoefficientInput = Readonly<{
  readonly actualFlowCubicMetersPerSecond: number;
  readonly areaSquareMeters: number;
  readonly pressureDifferencePascals: number;
  readonly densityKgPerM3: number;
}>;
export type OrificeDischargeCoefficientOutput = Readonly<{
  readonly dischargeCoefficient: number;
}>;

export const calculateOrificeDischargeCoefficient = (
  x: OrificeDischargeCoefficientInput,
): OrificeDischargeCoefficientOutput => {
  if (
    !Number.isFinite(x.actualFlowCubicMetersPerSecond) ||
    x.actualFlowCubicMetersPerSecond < 0
  )
    simpleError(
      "actualFlowCubicMetersPerSecond",
      "Provide a finite number at least 0.",
    );
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
  if (
    x.actualFlowCubicMetersPerSecond >
    x.areaSquareMeters *
      Math.sqrt((2 * x.pressureDifferencePascals) / x.densityKgPerM3)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const dischargeCoefficient =
    x.actualFlowCubicMetersPerSecond /
    (x.areaSquareMeters *
      Math.sqrt((2 * x.pressureDifferencePascals) / x.densityKgPerM3));
  if (!Number.isFinite(dischargeCoefficient))
    simpleError(
      "dischargeCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dischargeCoefficient: Object.is(dischargeCoefficient, -0)
      ? 0
      : dischargeCoefficient,
  };
};

export const example = {
  input: {
    actualFlowCubicMetersPerSecond: 0.002,
    areaSquareMeters: 0.001,
    pressureDifferencePascals: 10000,
    densityKgPerM3: 1000,
  },
  output: { dischargeCoefficient: 0.4472135954999579 },
} satisfies ToolExample<
  OrificeDischargeCoefficientInput,
  OrificeDischargeCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "engineering/orifice-discharge-coefficient",
  title: "Orifice Discharge Coefficient",
  description:
    "Measured orifice discharge coefficient Qactual/[A√(2Δp/ρ)] under incompressible conditions.",
  inputs: [
    {
      id: "actualFlowCubicMetersPerSecond",
      kind: "number",
      label: "Actual Flow Cubic Meters Per Second",
      unit: "m³/s",
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
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge Coefficient",
    },
  ],
  calculate: (input) =>
    calculateOrificeDischargeCoefficient({
      actualFlowCubicMetersPerSecond:
        input.actualFlowCubicMetersPerSecond as number,
      areaSquareMeters: input.areaSquareMeters as number,
      pressureDifferencePascals: input.pressureDifferencePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
    }),
});
export const orificeDischargeCoefficientTool = tool;
export const runOrificeDischargeCoefficient = tool.execute;
export default tool;
