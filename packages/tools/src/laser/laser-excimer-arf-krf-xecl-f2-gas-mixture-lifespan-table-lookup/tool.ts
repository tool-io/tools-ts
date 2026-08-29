import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExcimerGas = "F2" | "ArF" | "KrF" | "XeCl" | "XeF";

export type ExcimerLookupInput = {
  readonly gas: ExcimerGas;
};

export type ExcimerLookupOutput = {
  readonly wavelengthNm: number;
  readonly photonEnergyEv: number;
  readonly lifespanNote: string;
};

export const HC_EV_NM = 1239.842;

/** Excimer central wavelengths with cautions about system-dependent fill life. */
export const EXCIMER_TABLE: Record<
  ExcimerGas,
  { wavelengthNm: number; lifespanNote: string }
> = {
  F2: {
    wavelengthNm: 157.6,
    lifespanNote:
      "Gas-fill life is system-specific; fluorine handling, contamination, electrodes, operating conditions, and the manufacturer's refill procedure must be checked.",
  },
  ArF: {
    wavelengthNm: 193.3,
    lifespanNote:
      "Gas-fill life is system-specific; fluorine handling, contamination, electrodes, duty cycle, and gas processing determine the service interval.",
  },
  KrF: {
    wavelengthNm: 248.4,
    lifespanNote:
      "Gas-fill life cannot be inferred from KrF alone; pulse energy, repetition rate, electrodes, contamination, and gas processing all matter.",
  },
  XeCl: {
    wavelengthNm: 308.2,
    lifespanNote:
      "Gas-fill life cannot be inferred from XeCl alone; consult the laser's specified pulse count and refill procedure.",
  },
  XeF: {
    wavelengthNm: 351.1,
    lifespanNote:
      "Gas-fill life cannot be inferred from XeF alone; consult the laser's specified pulse count and refill procedure.",
  },
};

export const excimerLookup = (
  input: ExcimerLookupInput,
): ExcimerLookupOutput => {
  const entry = EXCIMER_TABLE[input.gas];
  if (!entry) simpleError("gas", "Gas must be a documented excimer mixture.");
  const photonEnergyEv = HC_EV_NM / entry.wavelengthNm;
  if (!Number.isFinite(photonEnergyEv))
    simpleError("gas", "Photon energy overflowed.");
  return {
    wavelengthNm: entry.wavelengthNm,
    photonEnergyEv,
    lifespanNote: entry.lifespanNote,
  };
};

export const excimerLookupExample = {
  input: { gas: "KrF" },
  output: {
    wavelengthNm: 248.4,
    photonEnergyEv: 4.991312399355878,
    lifespanNote:
      "Gas-fill life cannot be inferred from KrF alone; pulse energy, repetition rate, electrodes, contamination, and gas processing all matter.",
  },
} satisfies ToolExample<ExcimerLookupInput, ExcimerLookupOutput>;

export const excimerLookupTool = createSimpleTool({
  calculate: (input) => excimerLookup({ gas: input.gas as ExcimerGas }),
  description:
    "Look up an excimer or molecular-fluorine laser wavelength and photon energy, with a reminder that gas-fill life depends on the complete laser system.",
  id: "laser/laser-excimer-arf-krf-xecl-f2-gas-mixture-lifespan-table-lookup",
  inputs: [
    {
      description: "Excimer gas mixture.",
      enum: ["F2", "ArF", "KrF", "XeCl", "XeF"],
      id: "gas",
      kind: "string",
      label: "Gas",
    },
  ],
  outputs: [
    {
      description: "Central laser wavelength.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
    {
      description: "Photon energy hc/λ.",
      id: "photonEnergyEv",
      kind: "number",
      label: "Photon energy",
      unit: "eV",
    },
    {
      description: "Qualitative gas-fill lifespan guidance.",
      id: "lifespanNote",
      kind: "string",
      label: "Lifespan note",
    },
  ],
  title: "Excimer and F2 Gas Mixture Table",
});
export const runExcimerLookup = excimerLookupTool.execute;
export default excimerLookupTool;

export { excimerLookupExample as example };
