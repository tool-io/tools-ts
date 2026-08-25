import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BowspritLoadInput = {
  readonly deckAngleDeg: number;
  readonly forestayLoadNewtons: number;
};

export type BowspritLoadOutput = {
  readonly bowspritCompressionNewtons: number;
};

export const bowspritLoadExample = {
  input: { deckAngleDeg: 30, forestayLoadNewtons: 5000 },
  output: { bowspritCompressionNewtons: 10000.000000000002 },
} satisfies ToolExample<BowspritLoadInput, BowspritLoadOutput>;

export const bowspritLoadTool = createSimpleTool({
  calculate: (input) => {
    const forestayLoadNewtons = input.forestayLoadNewtons as number;
    const deckAngleDeg = input.deckAngleDeg as number;
    if (deckAngleDeg <= 0 || deckAngleDeg > 90)
      simpleError(
        "deckAngleDeg",
        "Deck angle must be greater than zero and no more than ninety degrees.",
        "invalid_angle",
      );
    return {
      bowspritCompressionNewtons:
        forestayLoadNewtons / Math.sin((deckAngleDeg * Math.PI) / 180),
    };
  },
  description:
    "Compute the ideal axial compression required to balance a forestay load at a specified angle to the deck.",
  id: "sailing/bowsprit-load",
  inputs: [
    {
      description: "Angle between the load direction and the deck.",
      id: "deckAngleDeg",
      kind: "number",
      label: "Deck angle",
      maximum: 90,
      minimum: 0,
      unit: "deg",
    },
    {
      description: "Tensile load in the forestay.",
      id: "forestayLoadNewtons",
      kind: "number",
      label: "Forestay load",
      minimum: 0,
      unit: "N",
    },
  ],
  outputs: [
    {
      description: "Compressive force along the bowsprit.",
      format: "force",
      id: "bowspritCompressionNewtons",
      kind: "number",
      label: "Bowsprit compression",
      unit: "N",
    },
  ],
  title: "Bowsprit Compression Load",
});
export const runBowspritLoad = bowspritLoadTool.execute;
export default bowspritLoadTool;
