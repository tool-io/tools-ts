import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuckleyLeverettFrontSaturationInput = {
  readonly irreducibleWaterSaturation?: number;
  readonly residualOilSaturation?: number;
  readonly waterViscosityMilliPascalSeconds?: number;
  readonly oilViscosityMilliPascalSeconds?: number;
};

export type BuckleyLeverettFrontSaturationOutput = {
  readonly frontWaterSaturation: number;
  readonly fractionalFlowAtFront: number;
};

const GRID_STEPS = 10000;

export const calculateBuckleyLeverettFrontSaturation = (
  input: BuckleyLeverettFrontSaturationInput,
): BuckleyLeverettFrontSaturationOutput => {
  const irreducibleWaterSaturation = input.irreducibleWaterSaturation ?? 0.2;
  const residualOilSaturation = input.residualOilSaturation ?? 0.2;
  const waterViscosityMilliPascalSeconds =
    input.waterViscosityMilliPascalSeconds ?? 1;
  const oilViscosityMilliPascalSeconds =
    input.oilViscosityMilliPascalSeconds ?? 1;
  if (!(irreducibleWaterSaturation >= 0 && irreducibleWaterSaturation < 1))
    simpleError(
      "irreducibleWaterSaturation",
      "Irreducible water saturation must lie in the interval zero to one.",
      "invalid_saturation",
    );
  if (!(residualOilSaturation >= 0 && residualOilSaturation < 1))
    simpleError(
      "residualOilSaturation",
      "Residual oil saturation must lie in the interval zero to one.",
      "invalid_saturation",
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
  const mobileRange = 1 - residualOilSaturation - irreducibleWaterSaturation;
  if (!(mobileRange > 0))
    simpleError(
      "residualOilSaturation",
      "Residual saturations must sum to less than one.",
      "invalid_saturation",
    );
  const fractionalFlow = (saturation: number): number => {
    const krw = ((saturation - irreducibleWaterSaturation) / mobileRange) ** 2;
    const kro = ((1 - saturation - residualOilSaturation) / mobileRange) ** 2;
    return (
      (krw * oilViscosityMilliPascalSeconds) /
      (krw * oilViscosityMilliPascalSeconds +
        kro * waterViscosityMilliPascalSeconds)
    );
  };
  let bestSlope = -Infinity;
  let frontSaturation = irreducibleWaterSaturation;
  let frontFractionalFlow = 0;
  for (let step = 1; step <= GRID_STEPS; step += 1) {
    const saturation =
      irreducibleWaterSaturation + (mobileRange * step) / GRID_STEPS;
    const flow = fractionalFlow(saturation);
    const slope = flow / (saturation - irreducibleWaterSaturation);
    if (slope > bestSlope) {
      bestSlope = slope;
      frontSaturation = saturation;
      frontFractionalFlow = flow;
    }
  }
  return {
    frontWaterSaturation: frontSaturation,
    fractionalFlowAtFront: frontFractionalFlow,
  };
};

export const buckleyLeverettFrontSaturationExample = {
  input: {},
  output: {
    frontWaterSaturation: 0.62426,
    fractionalFlowAtFront: 0.8535452048429992,
  },
} satisfies ToolExample<
  BuckleyLeverettFrontSaturationInput,
  BuckleyLeverettFrontSaturationOutput
>;

export const buckleyLeverettFrontSaturationTool = createSimpleTool({
  id: "geology/buckley-leverett-front-saturation",
  title: "Buckley Leverett Front Saturation Calculator",
  description:
    "Find the Buckley-Leverett shock-front water saturation by the Welge tangent construction on a Corey fractional-flow curve.",
  inputs: [
    {
      default: 0.2,
      description: "Irreducible (connate) water saturation as a fraction.",
      id: "irreducibleWaterSaturation",
      kind: "number",
      label: "Swc",
    },
    {
      default: 0.2,
      description: "Residual oil saturation as a fraction.",
      id: "residualOilSaturation",
      kind: "number",
      label: "Sor",
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
      description: "Shock-front water saturation as a fraction.",
      id: "frontWaterSaturation",
      kind: "number",
      label: "Swf",
    },
    {
      description: "Fractional flow of water evaluated at the front.",
      id: "fractionalFlowAtFront",
      kind: "number",
      label: "fw(Swf)",
    },
  ],
  calculate: (input) =>
    calculateBuckleyLeverettFrontSaturation(
      input as unknown as BuckleyLeverettFrontSaturationInput,
    ),
});

export const runBuckleyLeverettFrontSaturation =
  buckleyLeverettFrontSaturationTool.execute;
export default buckleyLeverettFrontSaturationTool;
