import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlaningPassDepthInput = {
  readonly passCount: number;
  readonly totalDepthMm: number;
};

export type PlaningPassDepthOutput = {
  readonly perPassMillimeters: number;
};

export const planingPassDepthExample = {
  input: { passCount: 4, totalDepthMm: 2 },
  output: { perPassMillimeters: 0.5 },
} satisfies ToolExample<PlaningPassDepthInput, PlaningPassDepthOutput>;

export const planingPassDepthTool = createSimpleTool({
  id: "carpentry/hobel-spanabnahme-pro-durchgang",
  title: "Planing Pass Depth Calculator",
  description:
    "Calculate the material removed per planing pass from the total depth and pass count.",
  inputs: [
    {
      id: "totalDepthMm",
      kind: "number",
      label: "Total depth",
      unit: "mm",
    },
    {
      id: "passCount",
      kind: "integer",
      label: "Pass count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "perPassMillimeters",
      kind: "number",
      label: "Depth per pass",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const totalDepthMm = input.totalDepthMm as number;
    const passCount = input.passCount as number;
    if (!(totalDepthMm > 0))
      simpleError(
        "totalDepthMm",
        "Total depth must be greater than zero.",
        "invalid_total_depth",
      );
    return { perPassMillimeters: totalDepthMm / passCount };
  },
});
export const runPlaningPassDepth = planingPassDepthTool.execute;
export default planingPassDepthTool;
