import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const tidalStressPhaseTriggerCheckerExample = {
  input: { coulombPhaseDeg: 120, isStrikeSlipOrNormal: true },
  output: { inPromotingWindow: true, phaseBand: "transition quadrant" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tidalStressPhaseTriggerCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ coulombPhaseDeg, isStrikeSlipOrNormal }) => {
      const inPromotingWindow = isStrikeSlipOrNormal
        ? coulombPhaseDeg > 90 || coulombPhaseDeg <= -90
        : coulombPhaseDeg > 0 && coulombPhaseDeg < 90;
      const phaseBand =
        Math.abs(coulombPhaseDeg) <= 45
          ? "peak-loading quadrant"
          : Math.abs(coulombPhaseDeg) <= 135
            ? "transition quadrant"
            : "unloading quadrant";
      return { inPromotingWindow, phaseBand };
    })(input as never) as Record<string, unknown>,
  description:
    "Check whether an event's tidal phase falls in the promoting window for its fault style.",
  id: "seismology/tidal-stress-phase-trigger-checker",
  inputs: [
    {
      minimum: -180,
      description: "Tidal Coulomb stress phase at event time.",
      id: "coulombPhaseDeg",
      kind: "number",
      label: "φ_CFF",
      unit: "°",
    },
    {
      description: "True for strike-slip/normal, false for thrust.",
      id: "isStrikeSlipOrNormal",
      kind: "boolean",
      label: "SS/NF?",
    },
  ],
  outputs: [
    {
      description: "Whether the phase promotes failure.",
      id: "inPromotingWindow",
      kind: "boolean",
      label: "Promoting",
    },
    {
      description: "Phase-band classification.",
      id: "phaseBand",
      kind: "string",
      label: "Band",
    },
  ],
  title: "Tidal Stress Phase Trigger Checker",
});
export const runTidalStressPhaseTriggerChecker =
  tidalStressPhaseTriggerCheckerTool.execute;
export { tidalStressPhaseTriggerCheckerExample as example };
export default tidalStressPhaseTriggerCheckerTool;
