import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rootShootRatioExample = {
  input: { rootDryMassG: 30, shootDryMassG: 60 },
  output: { rootShootRatio: 0.5 },
} satisfies ToolExample<
  { readonly rootDryMassG: number; readonly shootDryMassG: number },
  { readonly rootShootRatio: number }
>;

export const rootShootRatioTool = createSimpleTool({
  id: "biology/root-shoot-ratio",
  title: "Root-Shoot Ratio",
  description:
    "Compute the root-shoot ratio as belowground dry mass divided by aboveground dry mass.",
  inputs: [
    {
      description: "Root dry biomass; must not be negative.",
      id: "rootDryMassG",
      label: "Root dry mass",
      kind: "number",
      unit: "g",
    },
    {
      description: "Shoot dry biomass; must be greater than zero.",
      id: "shootDryMassG",
      label: "Shoot dry mass",
      kind: "number",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Root dry mass divided by shoot dry mass.",
      id: "rootShootRatio",
      label: "Root-shoot ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const rootDryMassG = input.rootDryMassG as number;
    const shootDryMassG = input.shootDryMassG as number;
    if (!(rootDryMassG >= 0))
      simpleError("rootDryMassG", "The root dry mass must not be negative.");
    if (!(shootDryMassG > 0))
      simpleError(
        "shootDryMassG",
        "The shoot dry mass must be greater than zero.",
      );
    return { rootShootRatio: rootDryMassG / shootDryMassG };
  },
});
export const runRootShootRatio = rootShootRatioTool.execute;
export default rootShootRatioTool;
