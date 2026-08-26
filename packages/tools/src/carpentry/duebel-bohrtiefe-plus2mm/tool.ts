import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DowelDrillDepthInput = {
  readonly dowelLengthMm: number;
};

export type DowelDrillDepthOutput = {
  readonly drillDepthMm: number;
};

export const dowelDrillDepthExample = {
  input: { dowelLengthMm: 30 },
  output: { drillDepthMm: 17 },
} satisfies ToolExample<DowelDrillDepthInput, DowelDrillDepthOutput>;

export const dowelDrillDepthTool = createSimpleTool({
  id: "carpentry/duebel-bohrtiefe-plus2mm",
  title: "Dowel Drill Depth Calculator",
  description:
    "Compute the blind-hole depth in each half of a centered dowel joint as half the dowel length plus 2 mm of glue and chip clearance.",
  inputs: [
    {
      description: "Dowel length in millimeters.",
      id: "dowelLengthMm",
      kind: "number",
      label: "Dowel length",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Required drilling depth in millimeters.",
      id: "drillDepthMm",
      kind: "number",
      label: "Drill depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const dowelLengthMm = input.dowelLengthMm as number;
    if (!(dowelLengthMm > 0))
      simpleError(
        "dowelLengthMm",
        "Dowel length must be greater than zero.",
        "must_be_positive",
      );
    return { drillDepthMm: dowelLengthMm / 2 + 2 };
  },
});
export const runDowelDrillDepth = dowelDrillDepthTool.execute;
export default dowelDrillDepthTool;
