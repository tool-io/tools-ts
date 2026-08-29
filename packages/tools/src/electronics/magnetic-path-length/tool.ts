import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { meanWidthM: 0.05, meanHeightM: 0.04 },
  output: { pathLengthM: 0.18 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/magnetic-path-length",
  title: "Rectangular Magnetic Path Length",
  description:
    "Estimate mean magnetic path length around a rectangular core centerline as 2(width+height). Use centerline dimensions, not external package dimensions; corners and air gaps are not corrected.",
  inputs: [
    {
      id: "meanWidthM",
      kind: "number",
      label: "Mean centerline width (m)",
      minimum: 0,
    },
    {
      id: "meanHeightM",
      kind: "number",
      label: "Mean centerline height (m)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "pathLengthM", kind: "number", label: "Path Length M" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { pathLengthM: 2 * (i.meanWidthM + i.meanHeightM) };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MagneticPathLengthInput = Readonly<typeof example.input>;
export type MagneticPathLengthOutput = Readonly<typeof example.output>;
export const magneticPathLengthTool = tool;
export const runMagneticPathLength = tool.execute;
export default tool;
