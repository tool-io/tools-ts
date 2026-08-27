import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FaultThrowInput = {
  readonly dipSlipM: number;
  readonly faultDipDeg: number;
};

export type FaultThrowOutput = {
  readonly throwM: number;
};

export const calculateFaultThrow = (
  input: FaultThrowInput,
): FaultThrowOutput => {
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
  return { throwM: dipSlipM * Math.sin((faultDipDeg * Math.PI) / 180) };
};

export const faultThrowExample = {
  input: { dipSlipM: 25, faultDipDeg: 55 },
  output: { throwM: 20.478801107224793 },
} satisfies ToolExample<FaultThrowInput, FaultThrowOutput>;

export const faultThrowTool = createSimpleTool({
  id: "geology/fault-throw",
  title: "Fault Throw Calculator",
  description:
    "Vertical component of net dip slip on a fault plane: throw = dip slip * sin(dip).",
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
      description: "Vertical fault throw in metres.",
      id: "throwM",
      kind: "number",
      label: "Throw",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateFaultThrow(input as unknown as FaultThrowInput),
});

export const runFaultThrow = faultThrowTool.execute;
export default faultThrowTool;
