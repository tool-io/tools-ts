import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TouchPanelCapacitanceInput = Readonly<{
  readonly overlapSquareMeters: number;
  readonly dielectricMeters: number;
  readonly relativePermittivity: number;
}>;
export type TouchPanelCapacitanceOutput = Readonly<{
  readonly capacitanceFarads: number;
}>;

export const calculateTouchPanelCapacitance = (
  x: TouchPanelCapacitanceInput,
): TouchPanelCapacitanceOutput => {
  if (!Number.isFinite(x.overlapSquareMeters) || x.overlapSquareMeters < 0)
    simpleError("overlapSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dielectricMeters) || x.dielectricMeters < 0)
    simpleError("dielectricMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.relativePermittivity) || x.relativePermittivity < 0)
    simpleError("relativePermittivity", "Provide a finite number at least 0.");
  const capacitanceFarads =
    (8.8541878128e-12 * x.relativePermittivity * x.overlapSquareMeters) /
    x.dielectricMeters;
  if (!Number.isFinite(capacitanceFarads))
    simpleError(
      "capacitanceFarads",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    capacitanceFarads: Object.is(capacitanceFarads, -0) ? 0 : capacitanceFarads,
  };
};

export const example = {
  input: {
    overlapSquareMeters: 0.01,
    dielectricMeters: 0.001,
    relativePermittivity: 2,
  },
  output: { capacitanceFarads: 1.77083756256e-10 },
} satisfies ToolExample<
  TouchPanelCapacitanceInput,
  TouchPanelCapacitanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/touch-panel-capacitance",
  title: "Touch Panel Capacitance",
  description:
    "Ideal parallel-plate touch electrode capacitance from overlap area, dielectric thickness and relative permittivity.",
  inputs: [
    {
      id: "overlapSquareMeters",
      kind: "number",
      label: "Overlap Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "dielectricMeters",
      kind: "number",
      label: "Dielectric Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "relativePermittivity",
      kind: "number",
      label: "Relative Permittivity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
    },
  ],
  calculate: (input) =>
    calculateTouchPanelCapacitance({
      overlapSquareMeters: input.overlapSquareMeters as number,
      dielectricMeters: input.dielectricMeters as number,
      relativePermittivity: input.relativePermittivity as number,
    }),
});
export const touchPanelCapacitanceTool = tool;
export const runTouchPanelCapacitance = tool.execute;
export default tool;
