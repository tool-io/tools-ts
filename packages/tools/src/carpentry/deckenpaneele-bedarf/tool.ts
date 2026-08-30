import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeckenpaneeleBedarfInput = Readonly<{
  readonly ceilingSquareMeters: number;
  readonly panelWidthMeters: number;
  readonly panelLengthMeters: number;
  readonly wastePercent: number;
}>;
export type DeckenpaneeleBedarfOutput = Readonly<{
  readonly panelCount: number;
}>;

export const calculateDeckenpaneeleBedarf = (
  x: DeckenpaneeleBedarfInput,
): DeckenpaneeleBedarfOutput => {
  if (!Number.isFinite(x.ceilingSquareMeters) || x.ceilingSquareMeters < 0)
    simpleError("ceilingSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.panelWidthMeters) || x.panelWidthMeters < 0)
    simpleError("panelWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.panelLengthMeters) || x.panelLengthMeters < 0)
    simpleError("panelLengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const panelCount = Math.ceil(
    (x.ceilingSquareMeters * (1 + x.wastePercent / 100)) /
      (x.panelWidthMeters * x.panelLengthMeters),
  );
  if (!Number.isFinite(panelCount) || !Number.isSafeInteger(panelCount))
    simpleError(
      "panelCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { panelCount: Object.is(panelCount, -0) ? 0 : panelCount };
};

export const example = {
  input: {
    ceilingSquareMeters: 20,
    panelWidthMeters: 0.2,
    panelLengthMeters: 2,
    wastePercent: 10,
  },
  output: { panelCount: 55 },
} satisfies ToolExample<DeckenpaneeleBedarfInput, DeckenpaneeleBedarfOutput>;

export const tool = createSimpleTool({
  id: "carpentry/deckenpaneele-bedarf",
  title: "Deckenpaneele Bedarf",
  description:
    "Area-based ceiling-panel quantity from ceiling area, each panel's coverage dimensions and a supplied waste percentage; layout may need more.",
  inputs: [
    {
      id: "ceilingSquareMeters",
      kind: "number",
      label: "Ceiling Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "panelWidthMeters",
      kind: "number",
      label: "Panel Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "panelLengthMeters",
      kind: "number",
      label: "Panel Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [{ id: "panelCount", kind: "integer", label: "Panel Count" }],
  calculate: (input) =>
    calculateDeckenpaneeleBedarf({
      ceilingSquareMeters: input.ceilingSquareMeters as number,
      panelWidthMeters: input.panelWidthMeters as number,
      panelLengthMeters: input.panelLengthMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const deckenpaneeleBedarfTool = tool;
export const runDeckenpaneeleBedarf = tool.execute;
export default tool;
