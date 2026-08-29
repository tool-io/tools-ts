import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeNeCavityInput = {
  readonly cavityLengthCm: number;
  readonly gainBandwidthGhz?: number;
};

export type HeNeCavityOutput = {
  readonly modeSpacingGhz: number;
  readonly modeSpacingCoversGainBandwidth: boolean;
  readonly maxSpacingCriterionLengthCm: number;
  readonly note: string;
};

export const SPEED_OF_LIGHT_M_PER_S = 299792458;
/** Doppler-broadened Ne gain bandwidth at 632.8 nm. */
export const NE_GAIN_BANDWIDTH_GHZ = 1.5;

/**
 * He-Ne 632.8 nm axial mode spacing Δν = c/2L; single longitudinal mode
 * needs the spacing to cover the ~1.5 GHz Doppler gain bandwidth.
 */
export const heNeCavity = (input: HeNeCavityInput): HeNeCavityOutput => {
  const { cavityLengthCm } = input;
  const gainBandwidthGhz = input.gainBandwidthGhz ?? NE_GAIN_BANDWIDTH_GHZ;
  if (!Number.isFinite(cavityLengthCm) || cavityLengthCm <= 0)
    simpleError("cavityLengthCm", "Cavity length must be positive.");
  if (!Number.isFinite(gainBandwidthGhz) || gainBandwidthGhz <= 0)
    simpleError("gainBandwidthGhz", "Gain bandwidth must be positive.");
  const modeSpacingGhz =
    SPEED_OF_LIGHT_M_PER_S / (2 * (cavityLengthCm / 100)) / 1e9;
  const maxSpacingCriterionLengthCm =
    (SPEED_OF_LIGHT_M_PER_S / (2 * gainBandwidthGhz * 1e9)) * 100;
  if (!Number.isFinite(modeSpacingGhz))
    simpleError("cavityLengthCm", "Mode spacing overflowed.");
  const modeSpacingCoversGainBandwidth = modeSpacingGhz >= gainBandwidthGhz;
  return {
    modeSpacingGhz,
    modeSpacingCoversGainBandwidth,
    maxSpacingCriterionLengthCm,
    note: modeSpacingCoversGainBandwidth
      ? "The axial-mode spacing is at least the supplied gain bandwidth. This is not by itself a guarantee of single-frequency or mode-hop-free operation."
      : "More than one axial-mode interval fits inside the supplied gain bandwidth; an additional frequency-selective element may be required.",
  };
};

export const heNeCavityExample = {
  input: { cavityLengthCm: 10, gainBandwidthGhz: 1.5 },
  output: {
    modeSpacingGhz: 1.49896229,
    modeSpacingCoversGainBandwidth: false,
    maxSpacingCriterionLengthCm: 9.993081933333334,
    note: "More than one axial-mode interval fits inside the supplied gain bandwidth; an additional frequency-selective element may be required.",
  },
} satisfies ToolExample<HeNeCavityInput, HeNeCavityOutput>;

export const heNeCavityTool = createSimpleTool({
  calculate: (input) =>
    heNeCavity({
      cavityLengthCm: input.cavityLengthCm as number,
      gainBandwidthGhz:
        (input.gainBandwidthGhz as number | undefined) ?? undefined,
    }),
  description:
    "Compare a He-Ne 632.8 nm optical cavity's c/(2L) axial-mode spacing with an explicit gain-bandwidth assumption; this does not guarantee mode-hop-free operation.",
  id: "laser/laser-he-ne-632-8-nm-mode-hop-free-cavity-length-tube-design-lookup",
  inputs: [
    {
      description:
        "Optical cavity length between mirrors, which may differ from plasma-tube length.",
      id: "cavityLengthCm",
      kind: "number",
      label: "Tube length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 1.5,
      description: "Gain-bandwidth assumption used for the spacing comparison.",
      id: "gainBandwidthGhz",
      kind: "number",
      label: "Gain bandwidth",
      minimum: Number.MIN_VALUE,
      unit: "GHz",
    },
  ],
  outputs: [
    {
      description: "Axial mode spacing c/2L.",
      id: "modeSpacingGhz",
      kind: "number",
      label: "Mode spacing",
      unit: "GHz",
    },
    {
      description: "True when one mode covers the gain bandwidth.",
      id: "modeSpacingCoversGainBandwidth",
      kind: "boolean",
      label: "Spacing covers bandwidth",
    },
    {
      description: "Longest tube keeping single-mode spacing (~10 cm).",
      id: "maxSpacingCriterionLengthCm",
      kind: "number",
      label: "Max criterion length",
      unit: "cm",
    },
    {
      description: "Design guidance for the length.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "HeNe Cavity Length Design",
});
export const runHeNeCavity = heNeCavityTool.execute;
export default heNeCavityTool;

export { heNeCavityExample as example };
