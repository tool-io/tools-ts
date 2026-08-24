import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GaasAlasBandOffsetInput = {
  readonly bandgapDifferenceEv: number;
  readonly conductionBandOffsetFraction?: number;
};

export type GaasAlasBandOffsetOutput = {
  readonly conductionBandOffsetEv: number;
  readonly valenceBandOffsetEv: number;
};

export const gaasAlasBandOffsetExample = {
  input: { bandgapDifferenceEv: 0.74, conductionBandOffsetFraction: 0.65 },
  output: { conductionBandOffsetEv: 0.481, valenceBandOffsetEv: 0.259 },
} satisfies ToolExample<GaasAlasBandOffsetInput, GaasAlasBandOffsetOutput>;

export const gaasAlasBandOffsetTool = createSimpleTool({
  calculate: (input) => {
    const bandgapDifferenceEv = input.bandgapDifferenceEv as number;
    const conductionBandOffsetFraction =
      input.conductionBandOffsetFraction as number;
    if (!(bandgapDifferenceEv > 0))
      simpleError(
        "bandgapDifferenceEv",
        "Band gap difference must be positive.",
        "degenerate_input",
      );
    if (!(conductionBandOffsetFraction > 0 && conductionBandOffsetFraction < 1))
      simpleError(
        "conductionBandOffsetFraction",
        "Conduction-band offset fraction must be between zero and one.",
        "invalid_offset_fraction",
      );
    return {
      conductionBandOffsetEv:
        conductionBandOffsetFraction * bandgapDifferenceEv,
      valenceBandOffsetEv:
        (1 - conductionBandOffsetFraction) * bandgapDifferenceEv,
    };
  },
  description:
    "Partition a GaAs/AlAs bandgap difference into conduction- and valence-band offsets using a supplied empirical offset fraction.",
  id: "semiconductor/gaas-alas-band-offset",
  inputs: [
    {
      id: "bandgapDifferenceEv",
      kind: "number",
      label: "Band gap difference",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 0.65,
      description:
        "Empirical fraction of the bandgap difference assigned to the conduction-band offset.",
      id: "conductionBandOffsetFraction",
      kind: "number",
      label: "Conduction-band offset fraction",
      maximum: 1 - Number.EPSILON,
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "conductionBandOffsetEv",
      kind: "number",
      label: "Conduction band offset",
      unit: "eV",
    },
    {
      id: "valenceBandOffsetEv",
      kind: "number",
      label: "Valence band offset",
      unit: "eV",
    },
  ],
  title: "GaAs/AlAs Band Offset Calculator",
});
export const runGaasAlasBandOffset = gaasAlasBandOffsetTool.execute;
export default gaasAlasBandOffsetTool;
