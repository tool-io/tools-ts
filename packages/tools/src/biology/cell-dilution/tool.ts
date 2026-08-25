import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellDilutionExample = {
  input: { c1Stock: 100, c2Target: 25, v2Final: 10 },
} satisfies ToolExample<{
  readonly c1Stock: number;
  readonly c2Target: number;
  readonly v2Final: number;
}>;

export const cellDilutionTool = createSimpleTool({
  id: "biology/cell-dilution",
  title: "Cell Dilution C1V1=C2V2",
  description:
    "Solve C1V1=C2V2 for the stock volume needed to reach a target concentration.",
  inputs: [
    {
      id: "c1Stock",
      label: "Stock concentration",
      kind: "number",
      unit: "cells/mL",
    },
    {
      id: "c2Target",
      label: "Target concentration",
      kind: "number",
      unit: "cells/mL",
    },
    { id: "v2Final", label: "Final volume", kind: "number", unit: "mL" },
  ],
  outputs: [
    { id: "stockVolumeMl", label: "Stock volume", kind: "number", unit: "mL" },
  ],
  calculate: (input) => {
    const c1Stock = input.c1Stock as number;
    const c2Target = input.c2Target as number;
    const v2Final = input.v2Final as number;
    if (c1Stock <= 0 || c2Target < 0 || v2Final <= 0)
      simpleError(
        "c1Stock",
        "Stock concentration and final volume must be positive; target concentration cannot be negative.",
        "invalid_value",
      );
    return { stockVolumeMl: (c2Target * v2Final) / c1Stock };
  },
});
export const runCellDilution = cellDilutionTool.execute;
export default cellDilutionTool;
