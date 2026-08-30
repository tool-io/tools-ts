import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResonantTunnelingDiodePeakToValleyRatioInput = Readonly<{
  readonly peakAmperes: number;
  readonly valleyAmperes: number;
}>;
export type ResonantTunnelingDiodePeakToValleyRatioOutput = Readonly<{
  readonly peakToValleyRatio: number;
}>;

export const calculateResonantTunnelingDiodePeakToValleyRatio = (
  x: ResonantTunnelingDiodePeakToValleyRatioInput,
): ResonantTunnelingDiodePeakToValleyRatioOutput => {
  if (!Number.isFinite(x.peakAmperes) || x.peakAmperes < 0)
    simpleError("peakAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.valleyAmperes) || x.valleyAmperes < 0)
    simpleError("valleyAmperes", "Provide a finite number at least 0.");
  if (x.valleyAmperes > x.peakAmperes)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const peakToValleyRatio = x.peakAmperes / x.valleyAmperes;
  if (!Number.isFinite(peakToValleyRatio))
    simpleError(
      "peakToValleyRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    peakToValleyRatio: Object.is(peakToValleyRatio, -0) ? 0 : peakToValleyRatio,
  };
};

export const example = {
  input: { peakAmperes: 0.02, valleyAmperes: 0.005 },
  output: { peakToValleyRatio: 4 },
} satisfies ToolExample<
  ResonantTunnelingDiodePeakToValleyRatioInput,
  ResonantTunnelingDiodePeakToValleyRatioOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/resonant-tunneling-diode-peak-to-valley-ratio",
  title: "Resonant Tunneling Diode Peak To Valley Ratio",
  description:
    "Peak-to-valley current ratio for a measured resonant-tunneling diode I–V curve.",
  inputs: [
    {
      id: "peakAmperes",
      kind: "number",
      label: "Peak Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "valleyAmperes",
      kind: "number",
      label: "Valley Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "peakToValleyRatio", kind: "number", label: "Peak To Valley Ratio" },
  ],
  calculate: (input) =>
    calculateResonantTunnelingDiodePeakToValleyRatio({
      peakAmperes: input.peakAmperes as number,
      valleyAmperes: input.valleyAmperes as number,
    }),
});
export const resonantTunnelingDiodePeakToValleyRatioTool = tool;
export const runResonantTunnelingDiodePeakToValleyRatio = tool.execute;
export default tool;
