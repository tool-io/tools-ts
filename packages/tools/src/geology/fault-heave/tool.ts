import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FaultHeaveInput = {
  readonly dipSlipM: number;
  readonly faultDipDeg: number;
};

export type FaultHeaveOutput = {
  readonly heaveM: number;
};

export const calculateFaultHeave = (
  input: FaultHeaveInput,
): FaultHeaveOutput => {
  const { dipSlipM, faultDipDeg } = input;
  if (!(dipSlipM >= 0))
    simpleError(
      "dipSlipM",
      "Net dip slip must be non-negative.",
      "invalid_slip",
    );
  if (!(faultDipDeg > 0 && faultDipDeg <= 90))
    simpleError(
      "faultDipDeg",
      "Fault dip must be greater than 0 and at most 90 degrees.",
      "invalid_dip",
    );
  return { heaveM: dipSlipM * Math.cos((faultDipDeg * Math.PI) / 180) };
};

export const faultHeaveExample = {
  input: { dipSlipM: 25, faultDipDeg: 55 },
  output: { heaveM: 14.339410908776152 },
} satisfies ToolExample<FaultHeaveInput, FaultHeaveOutput>;

export const faultHeaveTool = createSimpleTool({
  id: "geology/fault-heave",
  title: "Fault Heave Calculator",
  description:
    "Horizontal component of net dip slip on a fault plane: heave = dip slip * cos(dip).",
  inputs: [
    {
      description: "Net dip slip displacement in metres.",
      id: "dipSlipM",
      kind: "number",
      label: "Dip slip",
      unit: "m",
    },
    {
      description: "Fault plane dip in degrees.",
      id: "faultDipDeg",
      kind: "number",
      label: "Dip",
    },
  ],
  outputs: [
    {
      description: "Horizontal fault heave in metres.",
      id: "heaveM",
      kind: "number",
      label: "Heave",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateFaultHeave(input as unknown as FaultHeaveInput),
});

export const runFaultHeave = faultHeaveTool.execute;
export default faultHeaveTool;
