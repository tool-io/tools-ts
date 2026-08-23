import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateElectronMobility } from "../electron-mobility/tool.js";
import { calculateHoleMobility } from "../hole-mobility/tool.js";

export type ConductivityFromDopingInput = {
  readonly carrierType: "n" | "p";
  readonly dopingConcentrationPerCm3: number;
};

export type ConductivityFromDopingOutput = {
  readonly conductivitySPerCm: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const conductivityFromDopingExample = {
  input: { carrierType: "n", dopingConcentrationPerCm3: 1e16 },
  output: { conductivitySPerCm: 1.865117825180081 },
} satisfies ToolExample<
  ConductivityFromDopingInput,
  ConductivityFromDopingOutput
>;

export const calculateConductivityFromDoping = (
  input: ConductivityFromDopingInput,
): ConductivityFromDopingOutput => {
  const doping = input.dopingConcentrationPerCm3;
  if (!Number.isFinite(doping) || doping <= 0)
    simpleError(
      "dopingConcentrationPerCm3",
      "Doping must be a finite positive number.",
      "invalid_doping",
    );
  if (input.carrierType !== "n" && input.carrierType !== "p")
    simpleError(
      "carrierType",
      "Carrier type must be 'n' or 'p'.",
      "invalid_carrier_type",
    );
  const mobility =
    input.carrierType === "p"
      ? calculateHoleMobility({ acceptorConcentrationPerCm3: doping })
          .mobilityCm2PerVs
      : calculateElectronMobility({
          donorConcentrationPerCm3: doping,
        }).mobilityCm2PerVs;
  if (!Number.isFinite(mobility) || mobility <= 0)
    simpleError(
      "dopingConcentrationPerCm3",
      "Mobility could not be calculated.",
      "numeric_overflow",
    );
  const conductivitySPerCm = ELEMENTARY_CHARGE_C * mobility * doping;
  if (!Number.isFinite(conductivitySPerCm) || conductivitySPerCm <= 0)
    simpleError(
      "dopingConcentrationPerCm3",
      "Conductivity is outside the positive finite numeric range.",
      "numeric_range",
    );
  return {
    conductivitySPerCm,
  };
};

export const conductivityFromDopingTool = createSimpleTool({
  calculate: (input) =>
    calculateConductivityFromDoping({
      carrierType: input.carrierType as "n" | "p",
      dopingConcentrationPerCm3: input.dopingConcentrationPerCm3 as number,
    }),
  description:
    "Compute the silicon conductivity of uniformly doped material from majority-carrier mobility at 300 K. Assumes low-field Caughey-Thomas mobility and complete ionization.",
  id: "semiconductor/conductivity-from-doping",
  inputs: [
    {
      description: "Majority carrier type.",
      enum: ["n", "p"],
      id: "carrierType",
      kind: "string",
      label: "Carrier type",
    },
    {
      description:
        "Majority dopant concentration. Must be greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "dopingConcentrationPerCm3",
      kind: "number",
      label: "Doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description: "Material conductivity.",
      format: "conductivity",
      id: "conductivitySPerCm",
      kind: "number",
      label: "Conductivity",
      minimum: Number.MIN_VALUE,
      unit: "S/cm",
    },
  ],
  title: "Conductivity From Doping Calculator",
});
export const runConductivityFromDoping = conductivityFromDopingTool.execute;
export default conductivityFromDopingTool;
