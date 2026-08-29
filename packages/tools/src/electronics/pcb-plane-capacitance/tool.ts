import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbPlaneCapacitanceInput = Readonly<{
  readonly overlapAreaSquareMeters: number;
  readonly dielectricThicknessMeters: number;
  readonly relativePermittivity: number;
}>;
export type PcbPlaneCapacitanceOutput = Readonly<{ capacitanceFarads: number }>;

export const calculatePcbPlaneCapacitance = (
  i: PcbPlaneCapacitanceInput,
): PcbPlaneCapacitanceOutput => {
  if (i.relativePermittivity < 1)
    simpleError(
      "relativePermittivity",
      "Relative permittivity must be at least one.",
    );
  const value =
    (8.8541878128e-12 * i.relativePermittivity * i.overlapAreaSquareMeters) /
    i.dielectricThicknessMeters;
  if (!Number.isFinite(value))
    simpleError("capacitanceFarads", "The inputs produce a non-finite result.");
  return { capacitanceFarads: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    overlapAreaSquareMeters: 0.01,
    dielectricThicknessMeters: 0.001,
    relativePermittivity: 4.2,
  },
  output: { capacitanceFarads: 3.718758881376e-10 },
} satisfies ToolExample<PcbPlaneCapacitanceInput, PcbPlaneCapacitanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/pcb-plane-capacitance",
  title: "PCB Plane Capacitance",
  description:
    "Calculate ideal parallel-plane PCB capacitance as ε0 εr A/d from overlapping copper area, dielectric thickness, and relative permittivity; fringe fields are excluded.",
  inputs: [
    {
      id: "overlapAreaSquareMeters",
      kind: "number",
      label: "Overlap Area (m²)",
      unit: "m²",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "dielectricThicknessMeters",
      kind: "number",
      label: "Dielectric Thickness (m)",
      unit: "m",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "relativePermittivity",
      kind: "number",
      label: "Relative Permittivity",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance (F)",
      unit: "F",
    },
  ],
  calculate: (input) =>
    calculatePcbPlaneCapacitance({
      overlapAreaSquareMeters: input.overlapAreaSquareMeters as number,
      dielectricThicknessMeters: input.dielectricThicknessMeters as number,
      relativePermittivity: input.relativePermittivity as number,
    }),
});
export const pcbPlaneCapacitanceTool = tool;
export const runPcbPlaneCapacitance = tool.execute;
export default tool;
