import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetInversionChargeInput = {
  readonly coxFfPerUm2: number;
  readonly overdriveV: number;
};

export type MosfetInversionChargeOutput = {
  readonly inversionChargeUCm2: number;
};

export const mosfetInversionChargeExample = {
  input: { coxFfPerUm2: 17.26, overdriveV: 1 },
  output: { inversionChargeUCm2: 1.7260000000000002 },
} satisfies ToolExample<
  MosfetInversionChargeInput,
  MosfetInversionChargeOutput
>;

// 1 fF/µm² = 1e-7 F/cm², and 1 C = 1e6 µC.
export const calculateMosfetInversionCharge = (
  input: MosfetInversionChargeInput,
): MosfetInversionChargeOutput => {
  if (!Number.isFinite(input.coxFfPerUm2) || input.coxFfPerUm2 <= 0)
    simpleError(
      "coxFfPerUm2",
      "Gate capacitance must be a finite positive number.",
      "invalid_capacitance",
    );
  if (!Number.isFinite(input.overdriveV) || input.overdriveV <= 0)
    simpleError(
      "overdriveV",
      "Overdrive voltage must be a finite positive number.",
      "invalid_overdrive",
    );
  const inversionChargeUCm2 = input.coxFfPerUm2 * 0.1 * input.overdriveV;
  if (!Number.isFinite(inversionChargeUCm2) || inversionChargeUCm2 <= 0)
    simpleError(
      "overdriveV",
      "Inversion charge could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  return { inversionChargeUCm2 };
};

export const mosfetInversionChargeTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetInversionCharge({
      coxFfPerUm2: input.coxFfPerUm2 as number,
      overdriveV: input.overdriveV as number,
    }),
  description:
    "Estimate the magnitude of the strong-inversion sheet charge from oxide capacitance and overdrive voltage using |Qinv| = Cox·Vov.",
  id: "semiconductor/mosfet-inversion-charge",
  inputs: [
    {
      description:
        "Gate oxide capacitance per unit area. Must be greater than 0 fF/µm².",
      format: "capacitance-ff-um2",
      id: "coxFfPerUm2",
      kind: "number",
      label: "Cox",
      minimum: Number.MIN_VALUE,
      unit: "fF/µm²",
    },
    {
      description: "Gate voltage above threshold. Must be greater than 0 V.",
      id: "overdriveV",
      kind: "number",
      label: "Overdrive",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  outputs: [
    {
      description:
        "Magnitude of the ideal strong-inversion charge per unit gate area; the electron charge itself is negative for an n-channel MOSFET.",
      id: "inversionChargeUCm2",
      kind: "number",
      label: "|Qinv|",
      minimum: Number.MIN_VALUE,
      unit: "µC/cm²",
    },
  ],
  title: "MOSFET Inversion Charge Calculator",
});
export const runMosfetInversionCharge = mosfetInversionChargeTool.execute;
export default mosfetInversionChargeTool;
