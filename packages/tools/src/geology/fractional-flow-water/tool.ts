import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FractionalFlowWaterInput = {
  readonly waterRelativePermeability: number;
  readonly oilRelativePermeability: number;
  readonly waterViscosityMilliPascalSeconds?: number;
  readonly oilViscosityMilliPascalSeconds?: number;
};

export type FractionalFlowWaterOutput = {
  readonly waterFractionalFlow: number;
};

export const calculateFractionalFlowWater = (
  input: FractionalFlowWaterInput,
): FractionalFlowWaterOutput => {
  const waterViscosityMilliPascalSeconds =
    input.waterViscosityMilliPascalSeconds ?? 1;
  const oilViscosityMilliPascalSeconds =
    input.oilViscosityMilliPascalSeconds ?? 1;
  if (!(input.waterRelativePermeability >= 0))
    simpleError(
      "waterRelativePermeability",
      "Relative permeabilities must be non-negative.",
      "invalid_permeability",
    );
  if (!(input.oilRelativePermeability >= 0))
    simpleError(
      "oilRelativePermeability",
      "Relative permeabilities must be non-negative.",
      "invalid_permeability",
    );
  if (
    input.waterRelativePermeability === 0 &&
    input.oilRelativePermeability === 0
  )
    simpleError(
      "waterRelativePermeability",
      "Both relative permeabilities cannot be zero.",
      "invalid_permeability",
    );
  if (
    !(waterViscosityMilliPascalSeconds > 0) ||
    !(oilViscosityMilliPascalSeconds > 0)
  )
    simpleError(
      "waterViscosityMilliPascalSeconds",
      "Viscosities must be positive.",
      "invalid_viscosity",
    );
  return {
    waterFractionalFlow:
      (input.waterRelativePermeability * oilViscosityMilliPascalSeconds) /
      (input.waterRelativePermeability * oilViscosityMilliPascalSeconds +
        input.oilRelativePermeability * waterViscosityMilliPascalSeconds),
  };
};

export const fractionalFlowWaterExample = {
  input: {
    waterRelativePermeability: 0.3,
    oilRelativePermeability: 0.4,
    oilViscosityMilliPascalSeconds: 2,
  },
  output: { waterFractionalFlow: 0.6 },
} satisfies ToolExample<FractionalFlowWaterInput, FractionalFlowWaterOutput>;

export const fractionalFlowWaterTool = createSimpleTool({
  id: "geology/fractional-flow-water",
  title: "Fractional Flow Water Calculator",
  description:
    "Compute the water fractional flow fw from relative permeabilities and viscosities, neglecting gravity and capillary pressure.",
  inputs: [
    {
      description: "Water relative permeability.",
      id: "waterRelativePermeability",
      kind: "number",
      label: "krw",
    },
    {
      description: "Oil relative permeability.",
      id: "oilRelativePermeability",
      kind: "number",
      label: "kro",
    },
    {
      default: 1,
      description: "Water viscosity in millipascal seconds.",
      id: "waterViscosityMilliPascalSeconds",
      kind: "number",
      label: "Mu w",
    },
    {
      default: 1,
      description: "Oil viscosity in millipascal seconds.",
      id: "oilViscosityMilliPascalSeconds",
      kind: "number",
      label: "Mu o",
    },
  ],
  outputs: [
    {
      description: "Water fractional flow between zero and one.",
      id: "waterFractionalFlow",
      kind: "number",
      label: "fw",
    },
  ],
  calculate: (input) =>
    calculateFractionalFlowWater(input as unknown as FractionalFlowWaterInput),
});

export const runFractionalFlowWater = fractionalFlowWaterTool.execute;
export default fractionalFlowWaterTool;
