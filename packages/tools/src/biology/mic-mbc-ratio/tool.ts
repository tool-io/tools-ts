import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const micMbcRatioExample = {
  input: { mbcMgPerL: 8, micMgPerL: 2 },
  output: { mbcMicRatio: 4 },
} satisfies ToolExample<
  { readonly mbcMgPerL: number; readonly micMgPerL: number },
  { readonly mbcMicRatio: number }
>;

export const micMbcRatioTool = createSimpleTool({
  id: "biology/mic-mbc-ratio",
  title: "MIC/MBC Ratio",
  description:
    "Compute the ratio of minimum bactericidal concentration to minimum inhibitory concentration; a value of 1 to 4 indicates a bactericidal agent.",
  inputs: [
    {
      description:
        "Minimum inhibitory concentration; must be greater than zero.",
      id: "micMgPerL",
      label: "MIC",
      kind: "number",
      unit: "mg/L",
    },
    {
      description:
        "Minimum bactericidal concentration; must not fall below the MIC.",
      id: "mbcMgPerL",
      label: "MBC",
      kind: "number",
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "MBC divided by MIC.",
      id: "mbcMicRatio",
      label: "MBC/MIC ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const micMgPerL = input.micMgPerL as number;
    const mbcMgPerL = input.mbcMgPerL as number;
    if (!(micMgPerL > 0))
      simpleError("micMgPerL", "The MIC must be greater than zero.");
    if (!(mbcMgPerL >= 0))
      simpleError("mbcMgPerL", "The MBC must not be negative.");
    if (mbcMgPerL < micMgPerL)
      simpleError(
        "mbcMgPerL",
        "The MBC must not be less than the MIC.",
        "invalid_ratio",
      );
    return { mbcMicRatio: mbcMgPerL / micMgPerL };
  },
});
export const runMicMbcRatio = micMbcRatioTool.execute;
export default micMbcRatioTool;
