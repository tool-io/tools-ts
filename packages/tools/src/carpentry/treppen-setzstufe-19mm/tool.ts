import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RiserBoardThickness = "mdf" | "plywood" | "solid";

export type RiserBoardThicknessLookupInput = {
  readonly material: RiserBoardThickness;
};

export type RiserBoardThicknessLookupOutput = {
  readonly thicknessMm: number;
};

const RISER_BOARD_THICKNESS_MM: Record<RiserBoardThickness, number> = {
  mdf: 16,
  plywood: 19,
  solid: 19,
};

export const riserBoardThicknessLookupExample = {
  input: { material: "plywood" },
  output: { thicknessMm: 19 },
} satisfies ToolExample<
  RiserBoardThicknessLookupInput,
  RiserBoardThicknessLookupOutput
>;

export const riserBoardThicknessLookupTool = createSimpleTool({
  id: "carpentry/treppen-setzstufe-19mm",
  title: "Riser Board Thickness Lookup",
  description:
    "Look up the typical riser board thickness for plywood, MDF, and solid wood materials.",
  inputs: [
    {
      description: "Riser board material: plywood, MDF, or solid wood.",
      enum: ["plywood", "mdf", "solid"],
      id: "material",
      kind: "string",
      label: "Material",
    },
  ],
  outputs: [
    {
      description:
        "Typical riser board thickness in millimeters: 19 for plywood, 16 for MDF, and 19 for solid wood.",
      id: "thicknessMm",
      kind: "number",
      label: "Riser board thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => ({
    thicknessMm:
      RISER_BOARD_THICKNESS_MM[input.material as RiserBoardThickness],
  }),
});
export const runRiserBoardThicknessLookup =
  riserBoardThicknessLookupTool.execute;
export default riserBoardThicknessLookupTool;
