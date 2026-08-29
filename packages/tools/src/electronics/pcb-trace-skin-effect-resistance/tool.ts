import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbTraceSkinEffectResistanceInput = Readonly<{
  readonly resistivityOhmMeters: number;
  readonly relativePermeability: number;
  readonly frequencyHz: number;
  readonly traceLengthMeters: number;
  readonly traceWidthMeters: number;
  readonly traceThicknessMeters: number;
}>;
export type PcbTraceSkinEffectResistanceOutput = Readonly<{
  acResistanceOhms: number;
}>;

export const calculatePcbTraceSkinEffectResistance = (
  i: PcbTraceSkinEffectResistanceInput,
): PcbTraceSkinEffectResistanceOutput => {
  if (
    Math.sqrt(
      i.resistivityOhmMeters /
        (Math.PI * i.frequencyHz * 4 * Math.PI * 1e-7 * i.relativePermeability),
    ) >
    Math.min(i.traceWidthMeters, i.traceThicknessMeters) / 10
  )
    simpleError(
      "frequencyHz",
      "The high-frequency skin-depth approximation is not valid for this geometry.",
    );
  const value = (() => {
    const d = Math.sqrt(
      i.resistivityOhmMeters /
        (Math.PI * i.frequencyHz * 4 * Math.PI * 1e-7 * i.relativePermeability),
    );
    return (
      (i.resistivityOhmMeters * i.traceLengthMeters) /
      (2 * d * (i.traceWidthMeters + i.traceThicknessMeters))
    );
  })();
  if (!Number.isFinite(value))
    simpleError("acResistanceOhms", "The inputs produce a non-finite result.");
  return { acResistanceOhms: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    resistivityOhmMeters: 1.68e-8,
    relativePermeability: 1,
    frequencyHz: 1000000000,
    traceLengthMeters: 0.1,
    traceWidthMeters: 0.0002,
    traceThicknessMeters: 0.000035,
  },
  output: { acResistanceOhms: 1.7327529674841289 },
} satisfies ToolExample<
  PcbTraceSkinEffectResistanceInput,
  PcbTraceSkinEffectResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pcb-trace-skin-effect-resistance",
  title: "PCB Trace Skin Effect Resistance",
  description:
    "Estimate high-frequency PCB trace resistance with skin depth δ=√(ρ/(πfμ)) and effective conducting perimeter area 2δ(w+t); valid only when skin depth is much smaller than width and thickness.",
  inputs: [
    {
      id: "resistivityOhmMeters",
      kind: "number",
      label: "Resistivity (Ω·m)",
      unit: "Ω·m",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "relativePermeability",
      kind: "number",
      label: "Relative Permeability",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "traceLengthMeters",
      kind: "number",
      label: "Trace Length (m)",
      unit: "m",
      minimum: 0,
    },
    {
      id: "traceWidthMeters",
      kind: "number",
      label: "Trace Width (m)",
      unit: "m",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "traceThicknessMeters",
      kind: "number",
      label: "Trace Thickness (m)",
      unit: "m",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "acResistanceOhms",
      kind: "number",
      label: "Ac Resistance (Ω)",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculatePcbTraceSkinEffectResistance({
      resistivityOhmMeters: input.resistivityOhmMeters as number,
      relativePermeability: input.relativePermeability as number,
      frequencyHz: input.frequencyHz as number,
      traceLengthMeters: input.traceLengthMeters as number,
      traceWidthMeters: input.traceWidthMeters as number,
      traceThicknessMeters: input.traceThicknessMeters as number,
    }),
});
export const pcbTraceSkinEffectResistanceTool = tool;
export const runPcbTraceSkinEffectResistance = tool.execute;
export default tool;
