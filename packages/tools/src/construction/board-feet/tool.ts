import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoardFeetInput = Readonly<{
  readonly thicknessInches: number;
  readonly widthInches: number;
  readonly lengthFeet: number;
}>;
export type BoardFeetOutput = Readonly<{ boardFeet: number }>;

export const calculateBoardFeet = (i: BoardFeetInput): BoardFeetOutput => {
  const value = (i.thicknessInches * i.widthInches * i.lengthFeet) / 12;
  if (!Number.isFinite(value))
    simpleError("boardFeet", "The inputs produce a non-finite result.");
  return { boardFeet: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { thicknessInches: 2, widthInches: 8, lengthFeet: 10 },
  output: { boardFeet: 13.333333333333334 },
} satisfies ToolExample<BoardFeetInput, BoardFeetOutput>;

export const tool = createSimpleTool({
  id: "construction/board-feet",
  title: "Board Feet",
  description:
    "Calculate lumber board feet from nominal or actual thickness and width in inches and length in feet: thickness×width×length/12.",
  inputs: [
    {
      id: "thicknessInches",
      kind: "number",
      label: "Thickness (in)",
      unit: "in",
      minimum: 0,
    },
    {
      id: "widthInches",
      kind: "number",
      label: "Width (in)",
      unit: "in",
      minimum: 0,
    },
    { id: "lengthFeet", kind: "number", label: "Length Feet", minimum: 0 },
  ],
  outputs: [{ id: "boardFeet", kind: "number", label: "Board Feet" }],
  calculate: (input) =>
    calculateBoardFeet({
      thicknessInches: input.thicknessInches as number,
      widthInches: input.widthInches as number,
      lengthFeet: input.lengthFeet as number,
    }),
});
export const boardFeetTool = tool;
export const runBoardFeet = tool.execute;
export default tool;
