import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewCountDeckingInput = Readonly<{
  readonly deckAreaSquareMeters: number;
  readonly screwsPerSquareMeter: number;
}>;
export type ScrewCountDeckingOutput = Readonly<{ screwCount: number }>;

export const calculateScrewCountDecking = (
  i: ScrewCountDeckingInput,
): ScrewCountDeckingOutput => {
  const value = Math.ceil(i.deckAreaSquareMeters * i.screwsPerSquareMeter);
  if (!Number.isFinite(value))
    simpleError("screwCount", "The inputs produce a non-finite result.");
  return { screwCount: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { deckAreaSquareMeters: 30, screwsPerSquareMeter: 35 },
  output: { screwCount: 1050 },
} satisfies ToolExample<ScrewCountDeckingInput, ScrewCountDeckingOutput>;

export const tool = createSimpleTool({
  id: "construction/screw-count-decking",
  title: "Decking Screw Count",
  description:
    "Round up required decking screws from installed deck area and a project-specified screw density per square meter.",
  inputs: [
    {
      id: "deckAreaSquareMeters",
      kind: "number",
      label: "Deck Area (m²)",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "screwsPerSquareMeter",
      kind: "number",
      label: "Screws Per Square Meter",
      minimum: 0,
    },
  ],
  outputs: [{ id: "screwCount", kind: "integer", label: "Screw Count" }],
  calculate: (input) =>
    calculateScrewCountDecking({
      deckAreaSquareMeters: input.deckAreaSquareMeters as number,
      screwsPerSquareMeter: input.screwsPerSquareMeter as number,
    }),
});
export const screwCountDeckingTool = tool;
export const runScrewCountDecking = tool.execute;
export default tool;
