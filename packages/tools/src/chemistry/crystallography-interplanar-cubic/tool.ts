import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { latticeParameter: 0.4, h: 1, k: 1, l: 1 },
  output: { interplanarSpacing: 0.23094010767585033 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/crystallography-interplanar-cubic",
  title: "Cubic Interplanar Spacing",
  description:
    "Calculate dₕₖₗ=a/√(h²+k²+l²) for a cubic crystal. Miller indices cannot all be zero; lattice parameter and output share the same length unit.",
  inputs: [
    {
      id: "latticeParameter",
      kind: "number",
      label: "Cubic lattice parameter",
      minimum: Number.MIN_VALUE,
    },
    { id: "h", kind: "integer", label: "Miller index h" },
    { id: "k", kind: "integer", label: "Miller index k" },
    { id: "l", kind: "integer", label: "Miller index l" },
  ],
  outputs: [
    { id: "interplanarSpacing", kind: "number", label: "Interplanar Spacing" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.h === 0 && i.k === 0 && i.l === 0)
      simpleError("h", "At least one Miller index must be nonzero.");
    const output = {
      interplanarSpacing:
        i.latticeParameter / Math.sqrt(i.h * i.h + i.k * i.k + i.l * i.l),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CrystallographyInterplanarCubicInput = Readonly<
  typeof example.input
>;
export type CrystallographyInterplanarCubicOutput = Readonly<
  typeof example.output
>;
export const crystallographyInterplanarCubicTool = tool;
export const runCrystallographyInterplanarCubic = tool.execute;
export default tool;
