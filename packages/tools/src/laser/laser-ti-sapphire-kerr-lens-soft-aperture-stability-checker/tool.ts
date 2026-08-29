import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KerrLensSoftApertureInput = {
  readonly cwModeRadiusUm: number;
  readonly modeLockedRadiusUm: number;
  readonly pumpRadiusUm: number;
};

export type KerrLensSoftApertureOutput = {
  readonly cwPumpOverlap: number;
  readonly modeLockedPumpOverlap: number;
  readonly overlapGainPercent: number;
  readonly softApertureFavorsModeLockedMode: boolean;
  readonly note: string;
};

const gaussianPumpOverlap = (modeRadiusUm: number, pumpRadiusUm: number) => {
  const pumpRadiusSquared = pumpRadiusUm * pumpRadiusUm;
  return pumpRadiusSquared / (pumpRadiusSquared + modeRadiusUm * modeRadiusUm);
};

/**
 * Coaxial Gaussian gain-overlap proxy. It checks whether Kerr-lens shrinking
 * increases overlap with a Gaussian pump; it does not solve cavity stability.
 */
export const kerrLensSoftAperture = (
  input: KerrLensSoftApertureInput,
): KerrLensSoftApertureOutput => {
  const { cwModeRadiusUm, modeLockedRadiusUm, pumpRadiusUm } = input;
  for (const [field, value] of [
    ["cwModeRadiusUm", cwModeRadiusUm],
    ["modeLockedRadiusUm", modeLockedRadiusUm],
    ["pumpRadiusUm", pumpRadiusUm],
  ] as const) {
    if (!Number.isFinite(value) || value <= 0)
      simpleError(field, "Beam radii must be positive finite numbers.");
  }
  const cwPumpOverlap = gaussianPumpOverlap(cwModeRadiusUm, pumpRadiusUm);
  const modeLockedPumpOverlap = gaussianPumpOverlap(
    modeLockedRadiusUm,
    pumpRadiusUm,
  );
  const overlapGainPercent =
    ((modeLockedPumpOverlap - cwPumpOverlap) / cwPumpOverlap) * 100;
  if (!Number.isFinite(overlapGainPercent))
    simpleError("cwModeRadiusUm", "Overlap comparison overflowed.");
  return {
    cwPumpOverlap,
    modeLockedPumpOverlap,
    overlapGainPercent,
    softApertureFavorsModeLockedMode: modeLockedPumpOverlap > cwPumpOverlap,
    note: "This Gaussian overlap proxy omits ABCD stability, Kerr strength, crystal position, astigmatism, apertures, dispersion, and gain saturation.",
  };
};

export const kerrLensSoftApertureExample = {
  input: { cwModeRadiusUm: 30, modeLockedRadiusUm: 20, pumpRadiusUm: 25 },
  output: {
    cwPumpOverlap: 0.4098360655737705,
    modeLockedPumpOverlap: 0.6097560975609756,
    overlapGainPercent: 48.78048780487804,
    softApertureFavorsModeLockedMode: true,
    note: "This Gaussian overlap proxy omits ABCD stability, Kerr strength, crystal position, astigmatism, apertures, dispersion, and gain saturation.",
  },
} satisfies ToolExample<KerrLensSoftApertureInput, KerrLensSoftApertureOutput>;

export const kerrLensSoftApertureTool = createSimpleTool({
  calculate: (input) =>
    kerrLensSoftAperture({
      cwModeRadiusUm: input.cwModeRadiusUm as number,
      modeLockedRadiusUm: input.modeLockedRadiusUm as number,
      pumpRadiusUm: input.pumpRadiusUm as number,
    }),
  description:
    "Compare continuous-wave and mode-locked Ti:sapphire mode overlap with a Gaussian pump as a soft-aperture screening check, without claiming full cavity stability.",
  id: "laser/laser-ti-sapphire-kerr-lens-soft-aperture-stability-checker",
  inputs: [
    {
      description: "Calculated intracrystal CW mode radius.",
      id: "cwModeRadiusUm",
      kind: "number",
      label: "CW mode radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Calculated intracrystal mode-locked mode radius.",
      id: "modeLockedRadiusUm",
      kind: "number",
      label: "Mode-locked radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Gaussian pump-beam radius in the gain crystal.",
      id: "pumpRadiusUm",
      kind: "number",
      label: "Pump radius",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Normalized CW-mode overlap with the Gaussian pump.",
      id: "cwPumpOverlap",
      kind: "number",
      label: "CW overlap",
    },
    {
      description: "Normalized mode-locked overlap with the Gaussian pump.",
      id: "modeLockedPumpOverlap",
      kind: "number",
      label: "Mode-locked overlap",
    },
    {
      description: "Relative overlap increase from CW to mode-locked mode.",
      id: "overlapGainPercent",
      kind: "number",
      label: "Overlap gain",
      unit: "%",
    },
    {
      description: "Whether the supplied mode radii increase pump overlap.",
      id: "softApertureFavorsModeLockedMode",
      kind: "boolean",
      label: "Favors mode locking",
    },
    {
      description: "Important limits of the simplified overlap model.",
      id: "note",
      kind: "string",
      label: "Model limits",
    },
  ],
  title: "Ti:Sapphire Soft-Aperture Overlap Check",
});
export const runKerrLensSoftAperture = kerrLensSoftApertureTool.execute;
export default kerrLensSoftApertureTool;

export { kerrLensSoftApertureExample as example };
