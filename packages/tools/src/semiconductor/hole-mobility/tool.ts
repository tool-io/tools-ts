import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type HoleMobilityInput = {
  readonly acceptorConcentrationPerCm3: number;
};

export type HoleMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

/** Silicon Caughey-Thomas low-field parameters at 300 K. */
const MU_MIN = 54.3;
const MU_MAX = 406.9;
const NA_REFERENCE = 2.35e17;
const ALPHA = 0.88;

export const holeMobilityExample = {
  input: { acceptorConcentrationPerCm3: 1e16 },
  output: { mobilityCm2PerVs: 386.267321298 },
} satisfies ToolExample<HoleMobilityInput, HoleMobilityOutput>;

export const calculateHoleMobility = (
  input: HoleMobilityInput,
): HoleMobilityOutput => {
  const doping = input.acceptorConcentrationPerCm3;
  if (doping <= 0)
    simpleError(
      "acceptorConcentrationPerCm3",
      "Doping must be positive.",
      "invalid_doping",
    );
  const mobility =
    MU_MIN + (MU_MAX - MU_MIN) / (1 + (doping / NA_REFERENCE) ** ALPHA);
  return { mobilityCm2PerVs: roundStatistic(mobility) };
};

export const holeMobilityTool = createSimpleTool({
  calculate: (input) =>
    calculateHoleMobility(input as unknown as HoleMobilityInput),
  description:
    "Compute the silicon hole low-field mobility versus acceptor doping at 300 K (Caughey-Thomas).",
  id: "semiconductor/hole-mobility",
  inputs: [
    {
      description: "Acceptor doping concentration.",
      format: "density-per-cm3",
      id: "acceptorConcentrationPerCm3",
      kind: "number",
      label: "Na",
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description: "Hole mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Hole mobility",
      unit: "cm^2/Vs",
    },
  ],
  title: "Hole Mobility Calculator",
});
export const runHoleMobility = holeMobilityTool.execute;
export default holeMobilityTool;
