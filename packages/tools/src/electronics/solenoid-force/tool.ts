import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const MU_0 = 1.25663706212e-6;

export type SolenoidForceInput = {
  readonly crossSectionAreaM2: number;
  readonly currentAmps: number;
  readonly gapMeters: number;
  readonly turnsInt: number;
};

export type SolenoidForceOutput = {
  readonly solenoidForceNewtons: number;
};

export const solenoidForceExample = {
  input: {
    crossSectionAreaM2: 0.000125,
    currentAmps: 2,
    gapMeters: 0.002,
    turnsInt: 500,
  },
  output: { solenoidForceNewtons: 19.634954095625 },
} satisfies ToolExample<SolenoidForceInput, SolenoidForceOutput>;

export const calculateSolenoidForce = (
  input: SolenoidForceInput,
): SolenoidForceOutput => {
  if (!(input.currentAmps > 0))
    simpleError(
      "currentAmps",
      "Coil current must be positive.",
      "invalid_current",
    );
  if (!Number.isSafeInteger(input.turnsInt) || input.turnsInt < 1)
    simpleError(
      "turnsInt",
      "Turn count must be an integer of at least one.",
      "invalid_turns",
    );
  if (!(input.gapMeters > 0))
    simpleError("gapMeters", "Air gap must be positive.", "invalid_gap");
  if (!(input.crossSectionAreaM2 > 0))
    simpleError(
      "crossSectionAreaM2",
      "Cross-section area must be positive.",
      "invalid_area",
    );
  return {
    solenoidForceNewtons:
      (input.currentAmps *
        input.turnsInt *
        (input.currentAmps * input.turnsInt) *
        MU_0 *
        input.crossSectionAreaM2) /
      (2 * (input.gapMeters * input.gapMeters)),
  };
};

export const solenoidForceTool = createSimpleTool({
  calculate: (input) =>
    calculateSolenoidForce(input as unknown as SolenoidForceInput),
  description:
    "Estimate the attraction force of a solenoid actuator from ampere-turns, gap, and pole area.",
  id: "electronics/solenoid-force",
  inputs: [
    {
      description: "Coil drive current.",
      format: "current",
      id: "currentAmps",
      kind: "number",
      label: "Coil current",
      unit: "A",
    },
    {
      description: "Number of turns in the coil.",
      id: "turnsInt",
      kind: "integer",
      label: "Turn count",
      minimum: 1,
    },
    {
      description: "Cross-sectional area of the magnetic pole face.",
      format: "area",
      id: "crossSectionAreaM2",
      kind: "number",
      label: "Pole area",
      unit: "m²",
    },
    {
      description: "Working air gap between pole and armature.",
      format: "length",
      id: "gapMeters",
      kind: "number",
      label: "Air gap",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Estimated magnetic attraction force.",
      format: "force",
      id: "solenoidForceNewtons",
      kind: "number",
      label: "Solenoid force",
      unit: "N",
    },
  ],
  title: "Solenoid Force N",
});
export const runSolenoidForce = solenoidForceTool.execute;
export default solenoidForceTool;
