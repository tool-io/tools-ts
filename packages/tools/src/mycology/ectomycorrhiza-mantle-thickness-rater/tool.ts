import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EctomycorrhizaMantleThicknessRaterInput = {
  readonly thickMinimumUm: number;
  readonly thicknessUm: number;
  readonly thinMaximumUm: number;
};

export type EctomycorrhizaMantleThicknessRaterOutput = {
  readonly mantleGrade: string;
};

export const ectomycorrhizaMantleThicknessRaterExample = {
  input: { thickMinimumUm: 30.1, thicknessUm: 30, thinMaximumUm: 9.9 },
  output: { mantleGrade: "moderate" },
} satisfies ToolExample<
  EctomycorrhizaMantleThicknessRaterInput,
  EctomycorrhizaMantleThicknessRaterOutput
>;

export const ectomycorrhizaMantleThicknessRaterTool = createSimpleTool({
  id: "mycology/ectomycorrhiza-mantle-thickness-rater",
  title: "Mantle Thickness Rater",
  description:
    "Grade ectomycorrhizal mantle thickness using thin and thick boundaries supplied for the host, fungus, tissue section, and study protocol.",
  inputs: [
    {
      id: "thicknessUm",
      kind: "number",
      label: "Mantle thickness",
      unit: "µm",
    },
    {
      id: "thinMaximumUm",
      kind: "number",
      label: "Thin maximum",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      id: "thickMinimumUm",
      kind: "number",
      label: "Thick minimum",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      enum: ["thin", "moderate", "thick"],
      id: "mantleGrade",
      kind: "string",
      label: "Mantle grade",
    },
  ],
  calculate: (input) => {
    const thicknessUm = input.thicknessUm as number;
    const thinMaximumUm = input.thinMaximumUm as number;
    const thickMinimumUm = input.thickMinimumUm as number;
    if (!(thicknessUm > 0))
      simpleError(
        "thicknessUm",
        "Thickness must be greater than zero micrometres.",
      );
    if (!(thinMaximumUm > 0))
      simpleError(
        "thinMaximumUm",
        "The thin maximum must be greater than zero.",
      );
    if (!(thickMinimumUm > thinMaximumUm))
      simpleError(
        "thickMinimumUm",
        "The thick minimum must exceed the thin maximum.",
      );
    return {
      mantleGrade:
        thicknessUm <= thinMaximumUm
          ? "thin"
          : thicknessUm < thickMinimumUm
            ? "moderate"
            : "thick",
    };
  },
});
export const runEctomycorrhizaMantleThicknessRater =
  ectomycorrhizaMantleThicknessRaterTool.execute;
export default ectomycorrhizaMantleThicknessRaterTool;
