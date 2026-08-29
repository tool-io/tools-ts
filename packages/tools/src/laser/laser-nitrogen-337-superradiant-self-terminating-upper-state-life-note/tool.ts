import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NitrogenLifeInput = {
  readonly pumpPulseDurationNs: number;
};

export type NitrogenLifeOutput = {
  readonly upperLifetimeNs: number;
  readonly laserWavelengthNm: number;
  readonly selfTerminating: boolean;
  readonly pumpShorterThanUpperLifetime: boolean;
  readonly note: string;
};

/** Nominal N2(C³Πu) radiative lifetime and the 337.1 nm laser line. */
export const N2_UPPER_LIFETIME_NS = 40;
export const N2_LASER_WAVELENGTH_NM = 337.1;

/**
 * N2 337 nm self-termination note: the upper C state (~40 ns) empties far
 * faster than the lower B state, so inversion exists only during a fast
 * transverse pump pulse of comparable brevity.
 */
export const nitrogenLifeNote = (
  input: NitrogenLifeInput,
): NitrogenLifeOutput => {
  const { pumpPulseDurationNs } = input;
  if (!Number.isFinite(pumpPulseDurationNs) || pumpPulseDurationNs <= 0)
    simpleError("pumpPulseDurationNs", "Pump duration must be positive.");
  const selfTerminating = true;
  const pumpShorterThanUpperLifetime =
    pumpPulseDurationNs <= N2_UPPER_LIFETIME_NS;
  return {
    upperLifetimeNs: N2_UPPER_LIFETIME_NS,
    laserWavelengthNm: N2_LASER_WAVELENGTH_NM,
    selfTerminating,
    pumpShorterThanUpperLifetime,
    note: pumpShorterThanUpperLifetime
      ? "The pump pulse is no longer than the nominal upper-state lifetime. This comparison alone does not predict whether population inversion will develop."
      : "The pump pulse is longer than the nominal upper-state lifetime; discharge kinetics and the lower-state lifetime are still needed to model gain.",
  };
};

export const nitrogenLifeExample = {
  input: { pumpPulseDurationNs: 5 },
  output: {
    upperLifetimeNs: 40,
    laserWavelengthNm: 337.1,
    selfTerminating: true,
    pumpShorterThanUpperLifetime: true,
    note: "The pump pulse is no longer than the nominal upper-state lifetime. This comparison alone does not predict whether population inversion will develop.",
  },
} satisfies ToolExample<NitrogenLifeInput, NitrogenLifeOutput>;

export const nitrogenLifeTool = createSimpleTool({
  calculate: (input) =>
    nitrogenLifeNote({
      pumpPulseDurationNs: input.pumpPulseDurationNs as number,
    }),
  description:
    "Explain N2 337 nm self-terminating operation from the ~40 ns upper-state lifetime relative to the pump pulse duration.",
  id: "laser/laser-nitrogen-337-superradiant-self-terminating-upper-state-life-note",
  inputs: [
    {
      description: "Transverse discharge pump pulse duration.",
      id: "pumpPulseDurationNs",
      kind: "number",
      label: "Pump duration",
      minimum: Number.MIN_VALUE,
      unit: "ns",
    },
  ],
  outputs: [
    {
      description: "Nominal upper-state lifetime.",
      id: "upperLifetimeNs",
      kind: "number",
      label: "Upper lifetime",
      unit: "ns",
    },
    {
      description: "N2 laser wavelength.",
      id: "laserWavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
    {
      description: "Whether the transition self-terminates.",
      id: "selfTerminating",
      kind: "boolean",
      label: "Self-terminating",
    },
    {
      description:
        "Whether the supplied pump duration is no longer than the nominal upper-state lifetime.",
      id: "pumpShorterThanUpperLifetime",
      kind: "boolean",
      label: "Pump within lifetime",
    },
    {
      description: "Pumping guidance for the lifetime.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "N2 337 nm Self-Termination Note",
});
export const runNitrogenLife = nitrogenLifeTool.execute;
export default nitrogenLifeTool;

export { nitrogenLifeExample as example };
