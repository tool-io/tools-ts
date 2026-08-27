import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StomatalIndexInput = {
  readonly epidermalCellsInt: number;
  readonly stomataCellsInt: number;
};

export type StomatalIndexOutput = {
  readonly stomatalIndexPercent: number;
};

export const stomatalIndexExample = {
  input: { epidermalCellsInt: 60, stomataCellsInt: 40 },
  output: { stomatalIndexPercent: 40 },
} satisfies ToolExample<StomatalIndexInput, StomatalIndexOutput>;

export const stomatalIndexTool = createSimpleTool({
  id: "biology/stomatal-index",
  title: "Stomatal Index SI",
  description:
    "Compute the stomatal index in percent as the stomata count times one hundred over the total of stomata plus epidermal cells.",
  inputs: [
    {
      id: "stomataCellsInt",
      kind: "integer",
      label: "Stomata cells",
      minimum: 0,
      unit: "cells",
    },
    {
      id: "epidermalCellsInt",
      kind: "integer",
      label: "Epidermal cells",
      minimum: 0,
      unit: "cells",
    },
  ],
  outputs: [
    {
      id: "stomatalIndexPercent",
      kind: "number",
      label: "Stomatal index",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const stomataCellsInt = input.stomataCellsInt as number;
    const epidermalCellsInt = input.epidermalCellsInt as number;
    const total = stomataCellsInt + epidermalCellsInt;
    if (total <= 0)
      simpleError(
        "stomataCellsInt",
        "The cell total must include at least one cell.",
        "invalid_counts",
      );
    return { stomatalIndexPercent: (stomataCellsInt * 100) / total };
  },
});
export const runStomatalIndex = stomatalIndexTool.execute;
export default stomatalIndexTool;
