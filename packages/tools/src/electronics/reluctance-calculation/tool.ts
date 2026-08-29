import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    pathLengthM: 0.1,
    relativePermeability: 1000,
    crossSectionM2: 0.0001,
  },
  output: { reluctancePerH: 795774.7154594768 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/reluctance-calculation",
  title: "Magnetic Reluctance",
  description:
    "Calculate lumped magnetic reluctance ℛ=l/(μ₀μrA) for a uniform material segment. Use separate segments in series/parallel for mixed core and air-gap paths.",
  inputs: [
    { id: "pathLengthM", kind: "number", label: "Path length (m)", minimum: 0 },
    {
      id: "relativePermeability",
      kind: "number",
      label: "Relative permeability",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "crossSectionM2",
      kind: "number",
      label: "Cross-section (m²)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "reluctancePerH", kind: "number", label: "Reluctance Per H" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      reluctancePerH:
        i.pathLengthM /
        (4 * Math.PI * 1e-7 * i.relativePermeability * i.crossSectionM2),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ReluctanceCalculationInput = Readonly<typeof example.input>;
export type ReluctanceCalculationOutput = Readonly<typeof example.output>;
export const reluctanceCalculationTool = tool;
export const runReluctanceCalculation = tool.execute;
export default tool;
