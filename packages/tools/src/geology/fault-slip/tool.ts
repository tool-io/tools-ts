import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FaultSlipInput = {
  readonly heaveMeters: number;
  readonly throwMeters: number;
};

export type FaultSlipOutput = {
  readonly netSlipMeters: number;
  readonly faultDipDegrees: number;
};

export const calculateFaultSlip = (input: FaultSlipInput): FaultSlipOutput => {
  for (const key of ["heaveMeters", "throwMeters"] as const) {
    if (!(input[key] > 0))
      simpleError(
        key,
        "Displacement components must be greater than zero.",
        "invalid_displacement",
      );
  }
  const netSlipMeters = Math.hypot(input.heaveMeters, input.throwMeters);
  return {
    netSlipMeters,
    faultDipDegrees:
      (Math.atan(input.throwMeters / input.heaveMeters) * 180) / Math.PI,
  };
};

export const faultSlipExample = {
  input: { heaveMeters: 3, throwMeters: 4 },
  output: { netSlipMeters: 5, faultDipDegrees: 53.13010235415598 },
} satisfies ToolExample<FaultSlipInput, FaultSlipOutput>;

export const faultSlipTool = createSimpleTool({
  id: "geology/fault-slip",
  title: "Fault Slip Calculator",
  description:
    "Compute net slip and the implied dip of the slip vector from the heave (horizontal) and throw (vertical) components of dip-slip displacement.",
  inputs: [
    {
      description: "Heave: horizontal component of dip slip in meters.",
      id: "heaveMeters",
      kind: "number",
      label: "Heave",
      minimum: 0,
    },
    {
      description: "Throw: vertical component of dip slip in meters.",
      id: "throwMeters",
      kind: "number",
      label: "Throw",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Net slip in meters: sqrt(heave^2 + throw^2).",
      id: "netSlipMeters",
      kind: "number",
      label: "Net slip",
    },
    {
      description:
        "Angle of the slip vector above horizontal, equal to the fault dip for pure dip slip, in degrees.",
      id: "faultDipDegrees",
      kind: "number",
      label: "Slip dip",
    },
  ],
  calculate: (input) => calculateFaultSlip(input as unknown as FaultSlipInput),
});

export const runFaultSlip = faultSlipTool.execute;
export default faultSlipTool;
