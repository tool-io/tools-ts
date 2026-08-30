import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrenchShoringBoardsAreaInput = Readonly<{
  readonly trenchLengthM: number;
  readonly supportedDepthM: number;
}>;
export type TrenchShoringBoardsAreaOutput = Readonly<{
  readonly boardFaceAreaM2: number;
}>;

export const calculateTrenchShoringBoardsArea = (
  x: TrenchShoringBoardsAreaInput,
): TrenchShoringBoardsAreaOutput => {
  if (!Number.isFinite(x.trenchLengthM) || x.trenchLengthM < 0)
    simpleError("trenchLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.supportedDepthM) || x.supportedDepthM < 0)
    simpleError("supportedDepthM", "Provide a finite number at least 0.");
  const boardFaceAreaM2 = 2 * x.trenchLengthM * x.supportedDepthM;
  if (!Number.isFinite(boardFaceAreaM2))
    simpleError("boardFaceAreaM2", "The inputs produce an invalid result.");
  return {
    boardFaceAreaM2: Object.is(boardFaceAreaM2, -0) ? 0 : boardFaceAreaM2,
  };
};

export const example = {
  input: { trenchLengthM: 10, supportedDepthM: 2 },
  output: { boardFaceAreaM2: 40 },
} satisfies ToolExample<
  TrenchShoringBoardsAreaInput,
  TrenchShoringBoardsAreaOutput
>;

export const tool = createSimpleTool({
  id: "construction/trench-shoring-boards-area",
  title: "Trench Shoring Boards Area",
  description:
    "Find the face area of shoring on both vertical trench sides; excludes end walls, bracing, and overlaps.",
  inputs: [
    {
      id: "trenchLengthM",
      kind: "number",
      label: "Trench length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "supportedDepthM",
      kind: "number",
      label: "Supported depth",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "boardFaceAreaM2",
      kind: "number",
      label: "Two-sided board area",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateTrenchShoringBoardsArea({
      trenchLengthM: input.trenchLengthM as number,
      supportedDepthM: input.supportedDepthM as number,
    }),
});
export const trenchShoringBoardsAreaTool = tool;
export const runTrenchShoringBoardsArea = tool.execute;
export default tool;
