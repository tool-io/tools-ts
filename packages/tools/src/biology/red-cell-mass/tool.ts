import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RedCellMassInput = {
  readonly bloodVolumeMl: number;
  readonly hematocritFraction: number;
};

export type RedCellMassOutput = {
  readonly redCellMassMl: number;
};

export const redCellMassExample = {
  input: { bloodVolumeMl: 5000, hematocritFraction: 0.45 },
  output: { redCellMassMl: 2250 },
} satisfies ToolExample<RedCellMassInput, RedCellMassOutput>;

export const redCellMassTool = createSimpleTool({
  id: "biology/red-cell-mass",
  title: "Red Cell Mass mL",
  description:
    "Compute the red cell mass as blood volume times the hematocrit fraction.",
  inputs: [
    { id: "bloodVolumeMl", label: "Blood volume", kind: "number", unit: "mL" },
    {
      id: "hematocritFraction",
      label: "Hematocrit fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    { id: "redCellMassMl", label: "Red cell mass", kind: "number", unit: "mL" },
  ],
  calculate: (input) => {
    const bloodVolumeMl = input.bloodVolumeMl as number;
    if (bloodVolumeMl <= 0)
      simpleError(
        "bloodVolumeMl",
        "The blood volume must be greater than zero.",
      );
    return {
      redCellMassMl: bloodVolumeMl * (input.hematocritFraction as number),
    };
  },
});
export const runRedCellMass = redCellMassTool.execute;
export default redCellMassTool;
