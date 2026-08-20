import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  calculateElectronMobility,
} from "../electron-mobility/tool.js";
import {
  calculateHoleMobility,
} from "../hole-mobility/tool.js";

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
  output: { conductivitySPerCm: 1.86511782518 },
} satisfies ToolExample<ConductivityFromDopingInput, ConductivityFromDopingOutput>;

export const calculateConductivityFromDoping = (
  input: ConductivityFromDopingInput,
): ConductivityFromDopingOutput => {
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
  return {
    conductivitySPerCm: roundStatistic(
      ELEMENTARY_CHARGE_C * mobility * doping,
    ),
  };
};

export const conductivityFromDopingTool = createSimpleTool({
  calculate: (input) =>
    calculateConductivityFromDoping(
      input as unknown as ConductivityFromDopingInput,
    ),
  description:
    "Compute the silicon conductivity of uniformly doped material from majority-carrier mobility at 300 K.",
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
      description: "Material conductivity.",
      format: "conductivity",
      id: "conductivitySPerCm",
      kind: "number",
      label: "Conductivity",
      unit: "S/cm",
    },
  ],
  title: "Conductivity From Doping Calculator",
});
export const runConductivityFromDoping = conductivityFromDopingTool.execute;
export default conductivityFromDopingTool;
