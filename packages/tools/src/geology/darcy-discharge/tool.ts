import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DarcyDischargeInput = {
  readonly hydraulicConductivityMS: number;
  readonly hydraulicGradient: number;
  readonly crossSectionalAreaM2: number;
};

export type DarcyDischargeOutput = {
  readonly dischargeM3PerS: number;
};

export const calculateDarcyDischarge = (
  input: DarcyDischargeInput,
): DarcyDischargeOutput => {
  if (!(input.hydraulicConductivityMS >= 0))
    simpleError(
      "hydraulicConductivityMS",
      "Hydraulic conductivity must be non-negative.",
      "invalid_conductivity",
    );
  if (!(input.hydraulicGradient >= 0))
    simpleError(
      "hydraulicGradient",
      "Hydraulic gradient must be non-negative.",
      "invalid_gradient",
    );
  if (!(input.crossSectionalAreaM2 >= 0))
    simpleError(
      "crossSectionalAreaM2",
      "Cross-sectional area must be non-negative.",
      "invalid_area",
    );
  return {
    dischargeM3PerS:
      input.hydraulicConductivityMS *
      input.hydraulicGradient *
      input.crossSectionalAreaM2,
  };
};

export const darcyDischargeExample = {
  input: {
    hydraulicConductivityMS: 1e-6,
    hydraulicGradient: 0.01,
    crossSectionalAreaM2: 50,
  },
  output: { dischargeM3PerS: 5e-7 },
} satisfies ToolExample<DarcyDischargeInput, DarcyDischargeOutput>;

export const darcyDischargeTool = createSimpleTool({
  id: "geology/darcy-discharge",
  title: "Darcy Discharge Calculator",
  description:
    "Compute the total Darcy flow discharge in cubic meters per second as hydraulic conductivity times gradient times cross-sectional area.",
  inputs: [
    {
      description: "Hydraulic conductivity in meters per second.",
      id: "hydraulicConductivityMS",
      kind: "number",
      label: "K",
      minimum: 0,
    },
    {
      description: "Hydraulic gradient (dimensionless).",
      id: "hydraulicGradient",
      kind: "number",
      label: "i",
      minimum: 0,
    },
    {
      description: "Cross-sectional area normal to flow in square meters.",
      id: "crossSectionalAreaM2",
      kind: "number",
      label: "Area",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Discharge in cubic meters per second.",
      id: "dischargeM3PerS",
      kind: "number",
      label: "Q",
    },
  ],
  calculate: (input) =>
    calculateDarcyDischarge(input as unknown as DarcyDischargeInput),
});

export const runDarcyDischarge = darcyDischargeTool.execute;
export default darcyDischargeTool;
