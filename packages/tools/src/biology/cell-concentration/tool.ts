import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const cellConcentrationExample = {
  input: { countedConcentration: 250000, dilutionFactor: 4 },
} satisfies ToolExample<{
  readonly countedConcentration: number;
  readonly dilutionFactor: number;
}>;

export const cellConcentrationTool = createSimpleTool({
  id: "biology/cell-concentration",
  title: "Cell Concentration From Dilution",
  description:
    "Recover the original cell concentration by scaling a counted dilution.",
  inputs: [
    {
      id: "countedConcentration",
      label: "Counted concentration",
      kind: "number",
      minimum: 0,
      unit: "cells/mL",
    },
    {
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "originalConcentration",
      label: "Original concentration",
      kind: "number",
      unit: "cells/mL",
    },
  ],
  calculate: (input) => ({
    originalConcentration:
      (input.countedConcentration as number) * (input.dilutionFactor as number),
  }),
});
export const runCellConcentration = cellConcentrationTool.execute;
export default cellConcentrationTool;
