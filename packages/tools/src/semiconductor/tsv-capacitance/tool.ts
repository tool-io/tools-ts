import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TsvCapacitanceInput = {
  readonly heightUm: number;
  readonly oxideThicknessUm: number;
  readonly radiusUm: number;
  readonly relativePermittivity?: number;
};

export type TsvCapacitanceOutput = {
  readonly capacitanceFF: number;
};

export const VACUUM_PERMITTIVITY_F_PER_M = 8.854187817e-12;

export const tsvCapacitanceExample = {
  input: {
    heightUm: 20,
    oxideThicknessUm: 0.5,
    radiusUm: 5,
    relativePermittivity: 3.9,
  },
  output: { capacitanceFF: 45.528559774138216 },
} satisfies ToolExample<TsvCapacitanceInput, TsvCapacitanceOutput>;

export const tsvCapacitanceTool = createSimpleTool({
  calculate: (input) => {
    if (!((input.radiusUm as number) > 0))
      simpleError("radiusUm", "TSV radius must be positive.", "invalid_radius");
    if (!((input.oxideThicknessUm as number) > 0))
      simpleError(
        "oxideThicknessUm",
        "Oxide thickness must be positive.",
        "invalid_oxide_thickness",
      );
    if (!((input.heightUm as number) > 0))
      simpleError("heightUm", "TSV height must be positive.", "invalid_height");
    if (!((input.relativePermittivity as number) > 1))
      simpleError(
        "relativePermittivity",
        "Relative permittivity must exceed one.",
        "invalid_permittivity",
      );
    const farads =
      (2 *
        Math.PI *
        VACUUM_PERMITTIVITY_F_PER_M *
        (input.relativePermittivity as number) *
        ((input.heightUm as number) * 1e-6)) /
      Math.log1p(
        (input.oxideThicknessUm as number) / (input.radiusUm as number),
      );
    return { capacitanceFF: farads * 1e15 };
  },
  description:
    "Estimate the cylindrical oxide capacitance of a through-silicon via from its radius, oxide thickness, height, and dielectric permittivity.",
  id: "semiconductor/tsv-capacitance",
  inputs: [
    { id: "radiusUm", kind: "number", label: "Via radius", unit: "µm" },
    {
      id: "oxideThicknessUm",
      kind: "number",
      label: "Oxide thickness",
      unit: "µm",
    },
    { id: "heightUm", kind: "number", label: "Via height", unit: "µm" },
    {
      default: 3.9,
      id: "relativePermittivity",
      kind: "number",
      label: "Relative permittivity",
    },
  ],
  outputs: [
    { id: "capacitanceFF", kind: "number", label: "Capacitance", unit: "fF" },
  ],
  title: "TSV Capacitance Calculator",
});
export const runTsvCapacitance = tsvCapacitanceTool.execute;
export default tsvCapacitanceTool;
