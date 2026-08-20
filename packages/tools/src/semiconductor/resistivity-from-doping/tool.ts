import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  calculateElectronMobility,
} from "../electron-mobility/tool.js";
import {
  calculateHoleMobility,
} from "../hole-mobility/tool.js";

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
  output: { resistivityOhmCm: 0.536159156542 },
} satisfies ToolExample<ResistivityFromDopingInput, ResistivityFromDopingOutput>;

export const calculateResistivityFromDoping = (
  input: ResistivityFromDopingInput,
): ResistivityFromDopingOutput => {
  const doping = input.dopingConcentrationPerCm3;
  if (doping <= 0)
    simpleError(
      "dopingConcentrationPerCm3",
      "Doping must be positive.",
      "invalid_doping",
    );
  const mobility =
    input.carrierType === "p"
      ? calculateHoleMobility({ acceptorConcentrationPerCm3: doping })
          .mobilityCm2PerVs
      : calculateElectronMobility({
          donorConcentrationPerCm3: doping,
        }).mobilityCm2PerVs;
  const conductivity = ELEMENTARY_CHARGE_C * mobility * doping;
  return { resistivityOhmCm: roundStatistic(1 / conductivity) };
};

export const resistivityFromDopingTool = createSimpleTool({
  calculate: (input) =>
    calculateResistivityFromDoping(
      input as unknown as ResistivityFromDopingInput,
    ),
  description:
    "Compute the silicon resistivity of uniformly doped material from majority-carrier mobility at 300 K.",
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
      description: "Majority dopant concentration.",
      format: "density-per-cm3",
      id: "dopingConcentrationPerCm3",
      kind: "number",
      label: "Doping",
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
      unit: "Ω·cm",
    },
  ],
  title: "Resistivity From Doping Calculator",
});
export const runResistivityFromDoping = resistivityFromDopingTool.execute;
export default resistivityFromDopingTool;
