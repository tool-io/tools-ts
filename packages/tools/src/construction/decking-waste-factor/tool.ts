import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeckingWasteFactorInput = Readonly<{
  readonly netDeckAreaSquareMeters: number;
  readonly wastePercent: number;
}>;
export type DeckingWasteFactorOutput = Readonly<{
  purchasedAreaSquareMeters: number;
}>;

export const calculateDeckingWasteFactor = (
  i: DeckingWasteFactorInput,
): DeckingWasteFactorOutput => {
  if (i.wastePercent === 100)
    simpleError("wastePercent", "Waste percentage must be less than 100%.");
  const value = i.netDeckAreaSquareMeters / (1 - i.wastePercent / 100);
  if (!Number.isFinite(value))
    simpleError(
      "purchasedAreaSquareMeters",
      "The inputs produce a non-finite result.",
    );
  return { purchasedAreaSquareMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { netDeckAreaSquareMeters: 20, wastePercent: 10 },
  output: { purchasedAreaSquareMeters: 22.22222222222222 },
} satisfies ToolExample<DeckingWasteFactorInput, DeckingWasteFactorOutput>;

export const tool = createSimpleTool({
  id: "construction/decking-waste-factor",
  title: "Decking Waste Factor",
  description:
    "Find purchased decking area needed when the supplied waste percentage is a fraction of purchased area, so usable area is purchased area×(1−waste).",
  inputs: [
    {
      id: "netDeckAreaSquareMeters",
      kind: "number",
      label: "Net Deck Area (m²)",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "purchasedAreaSquareMeters",
      kind: "number",
      label: "Purchased Area (m²)",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateDeckingWasteFactor({
      netDeckAreaSquareMeters: input.netDeckAreaSquareMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const deckingWasteFactorTool = tool;
export const runDeckingWasteFactor = tool.execute;
export default tool;
