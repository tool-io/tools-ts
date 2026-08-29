import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { equilibriumConstant: 2, concentration: 0.5 },
  output: { coverageFraction: 0.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/langmuir-isotherm-theta",
  title: "Langmuir Surface Coverage",
  description:
    "Compute fractional site occupancy θ=KC/(1+KC) for a single-site Langmuir adsorption model. Concentration and K must use reciprocal units. This assumes equivalent sites, monolayer adsorption, and no adsorbate interactions.",
  inputs: [
    {
      id: "equilibriumConstant",
      kind: "number",
      label: "Adsorption equilibrium constant",
      minimum: 0,
    },
    {
      id: "concentration",
      kind: "number",
      label: "Equilibrium concentration",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "coverageFraction", kind: "number", label: "Coverage Fraction" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      coverageFraction:
        (i.equilibriumConstant * i.concentration) /
        (1 + i.equilibriumConstant * i.concentration),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type LangmuirIsothermThetaInput = Readonly<typeof example.input>;
export type LangmuirIsothermThetaOutput = Readonly<typeof example.output>;
export const langmuirIsothermThetaTool = tool;
export const runLangmuirIsothermTheta = tool.execute;
export default tool;
