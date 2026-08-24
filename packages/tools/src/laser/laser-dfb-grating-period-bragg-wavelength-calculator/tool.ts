import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DfbGratingPeriodInput = {
  readonly neff: number;
  readonly braggWavelengthNm: number;
  readonly order: number;
};

export type DfbGratingPeriodOutput = {
  readonly gratingPeriodNm: number;
};

/**
 * First-order Bragg condition for a DFB grating: lambda_B = 2 * n_eff * Lambda.
 * Higher diffraction orders scale the pitch by m: m * Lambda = lambda / n_eff.
 */
export const dfbGratingPeriodNm = (
  neff: number,
  braggWavelengthNm: number,
  order: number,
): number => (order * braggWavelengthNm) / (2 * neff);

export const dfbGratingPeriodExample = {
  input: { neff: 3.3, braggWavelengthNm: 1550, order: 1 },
  output: { gratingPeriodNm: (1 * 1550) / (2 * 3.3) },
} satisfies ToolExample<DfbGratingPeriodInput, DfbGratingPeriodOutput>;

export const dfbGratingPeriodTool = createSimpleTool({
  calculate: (input) => {
    const neff = input.neff as number;
    const braggWavelengthNm = input.braggWavelengthNm as number;
    const order = input.order as number;
    if (neff <= 1)
      simpleError("neff", "Effective index must exceed the surrounding air.");
    if (braggWavelengthNm <= 0)
      simpleError("braggWavelengthNm", "Bragg wavelength must be positive.");
    if (!Number.isInteger(order) || order < 1)
      simpleError("order", "Diffraction order must be at least one.");
    return {
      gratingPeriodNm: dfbGratingPeriodNm(neff, braggWavelengthNm, order),
    };
  },
  description:
    "Compute the DFB grating pitch that satisfies the Bragg condition for a target wavelength and effective index.",
  id: "laser/laser-dfb-grating-period-bragg-wavelength-calculator",
  inputs: [
    {
      description: "Effective refractive index of the lasing mode.",
      id: "neff",
      kind: "number",
      label: "n_eff",
      minimum: 1,
    },
    {
      description: "Target first-order Bragg wavelength.",
      id: "braggWavelengthNm",
      kind: "number",
      label: "Bragg wavelength",
      minimum: 0,
      unit: "nm",
    },
    {
      default: 1,
      description: "Diffraction order of the grating coupling.",
      id: "order",
      kind: "integer",
      label: "Order",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Required grating pitch.",
      id: "gratingPeriodNm",
      kind: "number",
      label: "Grating period",
      unit: "nm",
    },
  ],
  title: "DFB Grating Period Calculator",
});
export const runDfbGratingPeriod = dfbGratingPeriodTool.execute;
export default dfbGratingPeriodTool;

export { dfbGratingPeriodExample as example };
