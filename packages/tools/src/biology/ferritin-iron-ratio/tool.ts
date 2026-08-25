import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FerritinIronRatioInput = {
  readonly ferritinNgMl: number;
  readonly serumIronUgdL: number;
};

export type FerritinIronRatioOutput = {
  readonly ferritinIronRatio: number;
};

export const ferritinIronRatioExample = {
  input: { ferritinNgMl: 60, serumIronUgdL: 50 },
  output: { ferritinIronRatio: 1.2 },
} satisfies ToolExample<FerritinIronRatioInput, FerritinIronRatioOutput>;

export const ferritinIronRatioTool = createSimpleTool({
  id: "biology/ferritin-iron-ratio",
  title: "Ferritin Per Iron Ratio",
  description:
    "Compute the ratio of ferritin in nanograms per millilitre to serum iron in micrograms per decilitre.",
  inputs: [
    {
      id: "ferritinNgMl",
      label: "Ferritin",
      kind: "number",
      minimum: 0,
      unit: "ng/mL",
    },
    {
      id: "serumIronUgdL",
      label: "Serum iron",
      kind: "number",
      unit: "µg/dL",
    },
  ],
  outputs: [
    {
      id: "ferritinIronRatio",
      label: "Ferritin to iron ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const serumIronUgdL = input.serumIronUgdL as number;
    if (serumIronUgdL <= 0)
      simpleError("serumIronUgdL", "The serum iron must be greater than zero.");
    return {
      ferritinIronRatio: (input.ferritinNgMl as number) / serumIronUgdL,
    };
  },
});
export const runFerritinIronRatio = ferritinIronRatioTool.execute;
export default ferritinIronRatioTool;
