import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KantenanleimerBedarfInput = Readonly<{
  readonly panelCount: number;
  readonly edgesPerPanel: number;
  readonly edgeLengthMeters: number;
}>;
export type KantenanleimerBedarfOutput = Readonly<{
  readonly bandingMeters: number;
}>;

export const calculateKantenanleimerBedarf = (
  x: KantenanleimerBedarfInput,
): KantenanleimerBedarfOutput => {
  if (
    !Number.isFinite(x.panelCount) ||
    !Number.isSafeInteger(x.panelCount) ||
    x.panelCount < 0
  )
    simpleError("panelCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.edgesPerPanel) || x.edgesPerPanel < 0)
    simpleError("edgesPerPanel", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.edgeLengthMeters) || x.edgeLengthMeters < 0)
    simpleError("edgeLengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.panelCount) ||
    !Number.isSafeInteger(x.edgesPerPanel)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bandingMeters = x.panelCount * x.edgesPerPanel * x.edgeLengthMeters;
  if (!Number.isFinite(bandingMeters))
    simpleError(
      "bandingMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return { bandingMeters: Object.is(bandingMeters, -0) ? 0 : bandingMeters };
};

export const example = {
  input: { panelCount: 10, edgesPerPanel: 4, edgeLengthMeters: 0.5 },
  output: { bandingMeters: 20 },
} satisfies ToolExample<KantenanleimerBedarfInput, KantenanleimerBedarfOutput>;

export const tool = createSimpleTool({
  id: "carpentry/kantenanleimer-bedarf",
  title: "Kantenanleimer Bedarf",
  description:
    "Total edge-banding length from count of identical panels and number and length of edges banded on each panel.",
  inputs: [
    { id: "panelCount", kind: "integer", label: "Panel Count", minimum: 0 },
    {
      id: "edgesPerPanel",
      kind: "number",
      label: "Edges Per Panel",
      minimum: 0,
    },
    {
      id: "edgeLengthMeters",
      kind: "number",
      label: "Edge Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "bandingMeters", kind: "number", label: "Banding Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateKantenanleimerBedarf({
      panelCount: input.panelCount as number,
      edgesPerPanel: input.edgesPerPanel as number,
      edgeLengthMeters: input.edgeLengthMeters as number,
    }),
});
export const kantenanleimerBedarfTool = tool;
export const runKantenanleimerBedarf = tool.execute;
export default tool;
