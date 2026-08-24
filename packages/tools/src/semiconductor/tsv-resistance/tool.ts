import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TsvResistanceInput = {
  readonly heightUm: number;
  readonly radiusUm: number;
  readonly resistivityOhmM?: number;
};

export type TsvResistanceOutput = {
  readonly resistanceMilliohms: number;
};

export const RHO_COPPER_OHM_M = 1.68e-8;

export const tsvResistanceExample = {
  input: { heightUm: 50, radiusUm: 2.5 },
  output: { resistanceMilliohms: 42.780848703101476 },
} satisfies ToolExample<TsvResistanceInput, TsvResistanceOutput>;

export const tsvResistanceTool = createSimpleTool({
  calculate: (input) => {
    if (!((input.heightUm as number) > 0))
      simpleError("heightUm", "TSV height must be positive.", "invalid_height");
    if (!((input.radiusUm as number) > 0))
      simpleError("radiusUm", "TSV radius must be positive.", "invalid_radius");
    const resistivityOhmM = input.resistivityOhmM as number;
    if (!(resistivityOhmM > 0))
      simpleError(
        "resistivityOhmM",
        "Conductor resistivity must be positive.",
        "invalid_resistivity",
      );
    const areaM2 =
      Math.PI *
      (input.radiusUm as number) *
      1e-6 *
      ((input.radiusUm as number) * 1e-6);
    return {
      resistanceMilliohms:
        ((resistivityOhmM * ((input.heightUm as number) * 1e-6)) / areaM2) *
        1000,
    };
  },
  description:
    "Compute the DC resistance of a cylindrical copper through-silicon via from its height and radius.",
  id: "semiconductor/tsv-resistance",
  inputs: [
    { id: "heightUm", kind: "number", label: "Via height", unit: "µm" },
    { id: "radiusUm", kind: "number", label: "Via radius", unit: "µm" },
    {
      default: RHO_COPPER_OHM_M,
      description:
        "Conductor resistivity; the default is bulk copper near 20 °C.",
      id: "resistivityOhmM",
      kind: "number",
      label: "Resistivity",
      unit: "Ω·m",
    },
  ],
  outputs: [
    {
      id: "resistanceMilliohms",
      kind: "number",
      label: "Via resistance",
      unit: "mΩ",
    },
  ],
  title: "TSV Resistance Calculator",
});
export const runTsvResistance = tsvResistanceTool.execute;
export default tsvResistanceTool;
