import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateElectronMobility } from "../electron-mobility/tool.js";
import { calculateHoleMobility } from "../hole-mobility/tool.js";

export type ResistivityFromDopingInput = {
  readonly carrierType: "n" | "p";
  readonly dopingConcentrationPerCm3: number;
};

export type ResistivityFromDopingOutput = {
  readonly resistivityOhmCm: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const resistivityFromDopingExample = {
  input: { carrierType: "n", dopingConcentrationPerCm3: 1e16 },
  output: { resistivityOhmCm: 0.5361591565419991 },
} satisfies ToolExample<
  ResistivityFromDopingInput,
  ResistivityFromDopingOutput
>;

export const calculateResistivityFromDoping = (
  input: ResistivityFromDopingInput,
): ResistivityFromDopingOutput => {
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
  const conductivity = ELEMENTARY_CHARGE_C * mobility * doping;
  if (!Number.isFinite(conductivity) || conductivity <= 0)
    simpleError(
      "dopingConcentrationPerCm3",
      "Conductivity could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  const resistivityOhmCm = 1 / conductivity;
  if (!Number.isFinite(resistivityOhmCm))
    simpleError(
      "dopingConcentrationPerCm3",
      "Resistivity could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  return { resistivityOhmCm };
};

export const resistivityFromDopingTool = createSimpleTool({
  calculate: (input) =>
    calculateResistivityFromDoping({
      carrierType: input.carrierType as "n" | "p",
      dopingConcentrationPerCm3: input.dopingConcentrationPerCm3 as number,
    }),
  description:
    "Compute the silicon resistivity of uniformly doped material from majority-carrier mobility at 300 K. Assumes low-field Caughey-Thomas mobility and complete ionization.",
  id: "semiconductor/resistivity-from-doping",
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
      description: "Material resistivity.",
      format: "resistivity",
      id: "resistivityOhmCm",
      kind: "number",
      label: "Resistivity",
      minimum: Number.MIN_VALUE,
      unit: "Ω·cm",
    },
  ],
  title: "Resistivity From Doping Calculator",
});
export const runResistivityFromDoping = resistivityFromDopingTool.execute;
export default resistivityFromDopingTool;
