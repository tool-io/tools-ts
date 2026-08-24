import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetFlatbandVoltageExample = {
  input: {
    gateWorkFunctionEv: 4.05,
    semiconductorWorkFunctionEv: 4.15,
    oxideChargePerCm2: 1e10,
    coxFfPerUm2: 17.26,
  },
  output: { flatbandVoltageV: -0.10092825992699937 },
} satisfies ToolExample<
  MosfetFlatbandVoltageInput,
  MosfetFlatbandVoltageOutput
>;

export type MosfetFlatbandVoltageInput = {
  readonly gateWorkFunctionEv: number;
  readonly semiconductorWorkFunctionEv: number;
  readonly oxideChargePerCm2: number;
  readonly coxFfPerUm2: number;
};
export type MosfetFlatbandVoltageOutput = { readonly flatbandVoltageV: number };

export const calculateMosfetFlatbandVoltage = (
  input: MosfetFlatbandVoltageInput,
): MosfetFlatbandVoltageOutput => {
  for (const [field, value] of [
    ["gateWorkFunctionEv", input.gateWorkFunctionEv],
    ["semiconductorWorkFunctionEv", input.semiconductorWorkFunctionEv],
    ["coxFfPerUm2", input.coxFfPerUm2],
  ] as const)
    if (value <= 0)
      simpleError(field, `${field} must be positive.`, "invalid_input");
  if (input.coxFfPerUm2 <= 0)
    simpleError(
      "coxFfPerUm2",
      "Capacitance must be positive.",
      "invalid_input",
    );

  // 1 µm² = 1e-8 cm², so fF/µm² converts to 1e-7 F/cm².
  const coxFPerCm2 = input.coxFfPerUm2 * 1e-7;
  // Work function difference
  const phiMs = input.gateWorkFunctionEv - input.semiconductorWorkFunctionEv;
  // Fixed oxide charge converted to VFB offset
  const qDivCox = (input.oxideChargePerCm2 * 1.602176634e-19) / coxFPerCm2;
  const flatbandVoltageV = phiMs - qDivCox;
  if (!Number.isFinite(flatbandVoltageV))
    simpleError(
      "coxFfPerUm2",
      "The flatband voltage is outside the representable range.",
      "numeric_range",
    );
  return { flatbandVoltageV };
};

export const mosfetFlatbandVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetFlatbandVoltage({
      coxFfPerUm2: input.coxFfPerUm2 as number,
      gateWorkFunctionEv: input.gateWorkFunctionEv as number,
      oxideChargePerCm2: input.oxideChargePerCm2 as number,
      semiconductorWorkFunctionEv: input.semiconductorWorkFunctionEv as number,
    }),
  description:
    "Compute the flatband voltage from gate/semiconductor work functions and oxide charge.",
  id: "semiconductor/mosfet-flatband-voltage",
  inputs: [
    {
      format: "energy-ev",
      id: "gateWorkFunctionEv",
      kind: "number",
      label: "Gate work fn",
      unit: "eV",
    },
    {
      format: "energy-ev",
      id: "semiconductorWorkFunctionEv",
      kind: "number",
      label: "Semiconductor work fn",
      unit: "eV",
    },
    {
      description: "Effective fixed oxide charge per cm².",
      id: "oxideChargePerCm2",
      kind: "number",
      label: "Qox",
      unit: "cm^-2",
    },
    {
      format: "capacitance-ff-um2",
      id: "coxFfPerUm2",
      kind: "number",
      label: "Cox",
      minimum: Number.MIN_VALUE,
      unit: "fF/µm²",
    },
  ],
  outputs: [
    {
      description: "Flatband voltage.",
      format: "voltage-v",
      id: "flatbandVoltageV",
      kind: "number",
      label: "VFB",
      unit: "V",
    },
  ],
  title: "MOSFET Flatband Voltage Calculator",
});
export const runMosfetFlatbandVoltage = mosfetFlatbandVoltageTool.execute;
export default mosfetFlatbandVoltageTool;
