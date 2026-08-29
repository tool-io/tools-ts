import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    surfaceTensionSlopeNPerM: -0.01,
    speciesFactor: 1,
    temperatureK: 298.15,
  },
  output: { surfaceExcessMolPerM2: 0.000004033954554584697 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/gibbs-adsorption-isotherm",
  title: "Gibbs Surface Excess",
  description:
    "Estimate surface excess Γ from the slope dγ/dln(activity) using Γ=−slope/(nRT). Supply the appropriate ionic/species factor n; the ideal-activity approximation and chosen slope determine the result.",
  inputs: [
    {
      id: "surfaceTensionSlopeNPerM",
      kind: "number",
      label: "dγ/dln(activity) (N/m)",
    },
    {
      id: "speciesFactor",
      kind: "number",
      label: "Species factor n",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "temperatureK",
      kind: "number",
      label: "Temperature (K)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "surfaceExcessMolPerM2",
      kind: "number",
      label: "Surface Excess Mol Per M2",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      surfaceExcessMolPerM2:
        -i.surfaceTensionSlopeNPerM /
        (i.speciesFactor * 8.314462618 * i.temperatureK),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type GibbsAdsorptionIsothermInput = Readonly<typeof example.input>;
export type GibbsAdsorptionIsothermOutput = Readonly<typeof example.output>;
export const gibbsAdsorptionIsothermTool = tool;
export const runGibbsAdsorptionIsotherm = tool.execute;
export default tool;
