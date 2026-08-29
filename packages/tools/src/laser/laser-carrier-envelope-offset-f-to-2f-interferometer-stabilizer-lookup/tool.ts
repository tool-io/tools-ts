import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CeoOctaveInput = {
  readonly shortWavelengthNm: number;
  readonly longWavelengthNm: number;
};

export type CeoOctaveOutput = {
  readonly octaveRatio: number;
  readonly octaveSpanning: boolean;
  readonly note: string;
};

/**
 * f-to-2f carrier-envelope-offset stabilization needs an octave-spanning
 * comb: the long-wavelength edge must reach at least twice the short edge.
 */
export const ceoOctaveCheck = (input: CeoOctaveInput): CeoOctaveOutput => {
  const { shortWavelengthNm, longWavelengthNm } = input;
  if (!Number.isFinite(shortWavelengthNm) || shortWavelengthNm <= 0)
    simpleError("shortWavelengthNm", "Short wavelength must be positive.");
  if (!Number.isFinite(longWavelengthNm) || longWavelengthNm <= 0)
    simpleError("longWavelengthNm", "Long wavelength must be positive.");
  if (!(longWavelengthNm > shortWavelengthNm))
    simpleError(
      "longWavelengthNm",
      "Long wavelength must exceed the short wavelength.",
    );
  const octaveRatio = longWavelengthNm / shortWavelengthNm;
  if (!Number.isFinite(octaveRatio))
    simpleError("longWavelengthNm", "Octave ratio overflowed.");
  const octaveSpanning = octaveRatio >= 2;
  return {
    octaveRatio,
    octaveSpanning,
    note: octaveSpanning
      ? "The frequency-doubled long-wavelength edge reaches the short-wavelength edge. Spectral overlap and beat-note signal quality must still be verified."
      : "The wavelength span is below one octave, so these spectral edges cannot form a direct f-to-2f beat.",
  };
};

export const ceoOctaveExample = {
  input: { shortWavelengthNm: 532, longWavelengthNm: 1064 },
  output: {
    octaveRatio: 2,
    octaveSpanning: true,
    note: "The frequency-doubled long-wavelength edge reaches the short-wavelength edge. Spectral overlap and beat-note signal quality must still be verified.",
  },
} satisfies ToolExample<CeoOctaveInput, CeoOctaveOutput>;

export const ceoOctaveTool = createSimpleTool({
  calculate: (input) =>
    ceoOctaveCheck({
      longWavelengthNm: input.longWavelengthNm as number,
      shortWavelengthNm: input.shortWavelengthNm as number,
    }),
  description:
    "Check whether a frequency-comb span supports f-to-2f carrier-envelope-offset stabilization via the octave criterion.",
  id: "laser/laser-carrier-envelope-offset-f-to-2f-interferometer-stabilizer-lookup",
  inputs: [
    {
      description: "Short-wavelength edge of the broadened comb.",
      id: "shortWavelengthNm",
      kind: "number",
      label: "Short edge",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Long-wavelength edge of the broadened comb.",
      id: "longWavelengthNm",
      kind: "number",
      label: "Long edge",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Long-to-short wavelength ratio.",
      id: "octaveRatio",
      kind: "number",
      label: "Octave ratio",
    },
    {
      description: "True when the ratio reaches 2 (one octave).",
      id: "octaveSpanning",
      kind: "boolean",
      label: "Octave spanning",
    },
    {
      description: "Stabilizer guidance for the span.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "CEO f-to-2f Octave Check",
});
export const runCeoOctave = ceoOctaveTool.execute;
export default ceoOctaveTool;

export { ceoOctaveExample as example };
