import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeckingGapSpacingInput = Readonly<{
  readonly installedGapMm: number;
  readonly expectedBoardWidthChangeMm: number;
}>;
export type DeckingGapSpacingOutput = Readonly<{
  readonly predictedGapMm: number;
}>;

export const calculateDeckingGapSpacing = (
  x: DeckingGapSpacingInput,
): DeckingGapSpacingOutput => {
  if (!Number.isFinite(x.installedGapMm) || x.installedGapMm < 0)
    simpleError("installedGapMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.expectedBoardWidthChangeMm))
    simpleError("expectedBoardWidthChangeMm", "Provide a finite number.");
  if (!(x.installedGapMm >= x.expectedBoardWidthChangeMm))
    simpleError(
      "expectedBoardWidthChangeMm",
      "Predicted expansion would close the gap.",
    );
  const predictedGapMm = x.installedGapMm - x.expectedBoardWidthChangeMm;
  if (!Number.isFinite(predictedGapMm))
    simpleError("predictedGapMm", "The inputs produce an invalid result.");
  return { predictedGapMm: Object.is(predictedGapMm, -0) ? 0 : predictedGapMm };
};

export const example = {
  input: { installedGapMm: 5, expectedBoardWidthChangeMm: -1 },
  output: { predictedGapMm: 6 },
} satisfies ToolExample<DeckingGapSpacingInput, DeckingGapSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/decking-gap-spacing",
  title: "Decking Gap Spacing",
  description:
    "Predict clear decking gap after a specified signed change in board width; positive board expansion reduces the gap.",
  inputs: [
    {
      id: "installedGapMm",
      kind: "number",
      label: "Installed clear gap",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "expectedBoardWidthChangeMm",
      kind: "number",
      label: "Expected board width change",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "predictedGapMm",
      kind: "number",
      label: "Predicted clear gap",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDeckingGapSpacing({
      installedGapMm: input.installedGapMm as number,
      expectedBoardWidthChangeMm: input.expectedBoardWidthChangeMm as number,
    }),
});
export const deckingGapSpacingTool = tool;
export const runDeckingGapSpacing = tool.execute;
export default tool;
