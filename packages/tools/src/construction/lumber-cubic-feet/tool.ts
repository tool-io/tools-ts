import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberCubicFeetInput = Readonly<{
  readonly thicknessInches: number;
  readonly widthInches: number;
  readonly lengthFeet: number;
}>;
export type LumberCubicFeetOutput = Readonly<{ volumeCubicFeet: number }>;

export const calculateLumberCubicFeet = (
  i: LumberCubicFeetInput,
): LumberCubicFeetOutput => {
  const value = (i.thicknessInches * i.widthInches * i.lengthFeet) / 144;
  if (!Number.isFinite(value))
    simpleError("volumeCubicFeet", "The inputs produce a non-finite result.");
  return { volumeCubicFeet: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { thicknessInches: 1.5, widthInches: 7.25, lengthFeet: 10 },
  output: { volumeCubicFeet: 0.7552083333333334 },
} satisfies ToolExample<LumberCubicFeetInput, LumberCubicFeetOutput>;

export const tool = createSimpleTool({
  id: "construction/lumber-cubic-feet",
  title: "Lumber Cubic Feet",
  description:
    "Calculate lumber volume in cubic feet from thickness and width in inches and length in feet; use actual dimensions when physical volume matters.",
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
  outputs: [
    {
      id: "volumeCubicFeet",
      kind: "number",
      label: "Volume (ft³)",
      unit: "ft³",
    },
  ],
  calculate: (input) =>
    calculateLumberCubicFeet({
      thicknessInches: input.thicknessInches as number,
      widthInches: input.widthInches as number,
      lengthFeet: input.lengthFeet as number,
    }),
});
export const lumberCubicFeetTool = tool;
export const runLumberCubicFeet = tool.execute;
export default tool;
