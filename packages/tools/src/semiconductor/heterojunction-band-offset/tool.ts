import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeterojunctionBandOffsetInput = {
  readonly bandgapDifferenceEv: number;
  readonly conductionBandOffsetFraction?: number;
};

export type HeterojunctionBandOffsetOutput = {
  readonly conductionBandOffsetEv: number;
  readonly valenceBandOffsetEv: number;
};

export const heterojunctionBandOffsetExample = {
  input: { bandgapDifferenceEv: 1.24, conductionBandOffsetFraction: 0.65 },
  output: {
    conductionBandOffsetEv: 0.806,
    valenceBandOffsetEv: 0.43399999999999994,
  },
} satisfies ToolExample<
  HeterojunctionBandOffsetInput,
  HeterojunctionBandOffsetOutput
>;

export const calculateHeterojunctionBandOffset = (
  input: HeterojunctionBandOffsetInput,
): HeterojunctionBandOffsetOutput => {
  if (
    !Number.isFinite(input.bandgapDifferenceEv) ||
    input.bandgapDifferenceEv <= 0
  )
    simpleError("bandgapDifferenceEv", "Bandgap difference must be positive.");
  const fraction = input.conductionBandOffsetFraction ?? 0.65;
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction >= 1)
    simpleError(
      "conductionBandOffsetFraction",
      "Conduction-band offset fraction must be between zero and one.",
    );
  const conductionBandOffsetEv = fraction * input.bandgapDifferenceEv;
  return {
    conductionBandOffsetEv,
    valenceBandOffsetEv: input.bandgapDifferenceEv - conductionBandOffsetEv,
  };
};

export const heterojunctionBandOffsetTool = createSimpleTool({
  calculate: (input) =>
    calculateHeterojunctionBandOffset({
      bandgapDifferenceEv: input.bandgapDifferenceEv as number,
      conductionBandOffsetFraction:
        input.conductionBandOffsetFraction as number,
    }),
  description:
    "Partition a heterojunction bandgap difference into conduction- and valence-band offsets using a material-specific empirical fraction.",
  id: "semiconductor/heterojunction-band-offset",
  inputs: [
    {
      description: "Difference between the two semiconductor bandgaps.",
      id: "bandgapDifferenceEv",
      kind: "number",
      label: "Bandgap difference",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 0.65,
      description:
        "Empirical fraction of the bandgap discontinuity assigned to the conduction band.",
      id: "conductionBandOffsetFraction",
      kind: "number",
      label: "Conduction-band fraction",
      maximum: 1 - Number.EPSILON,
      minimum: Number.MIN_VALUE,
      unit: "ratio",
    },
  ],
  outputs: [
    {
      description: "Conduction band offset.",
      id: "conductionBandOffsetEv",
      kind: "number",
      label: "Conduction band offset",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Valence band offset.",
      id: "valenceBandOffsetEv",
      kind: "number",
      label: "Valence band offset",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  title: "Heterojunction Band Offset Calculator",
});
export const runHeterojunctionBandOffset = heterojunctionBandOffsetTool.execute;
export default heterojunctionBandOffsetTool;
