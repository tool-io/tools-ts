import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CmrrDbInput = {
  readonly differentialGain: number;
  readonly commonModeGain: number;
};

export type CmrrDbOutput = {
  readonly cmrrDb: number;
};

export const cmrrDbExample = {
  input: { differentialGain: 100000, commonModeGain: 10 },
  output: { cmrrDb: 80 },
} satisfies ToolExample<CmrrDbInput, CmrrDbOutput>;

export const cmrrDbTool = createSimpleTool({
  id: "electronics/cmrr-db",
  title: "CMRR dB",
  description:
    "Compute the common-mode rejection ratio in decibels as 20 x log10(differential gain / common mode gain).",
  inputs: [
    { id: "differentialGain", label: "Differential gain", kind: "number" },
    { id: "commonModeGain", label: "Common mode gain", kind: "number" },
  ],
  outputs: [{ id: "cmrrDb", label: "CMRR", kind: "number", unit: "dB" }],
  calculate: (input) => {
    const differentialGain = input.differentialGain as number;
    const commonModeGain = input.commonModeGain as number;
    if (!(differentialGain > 0))
      simpleError(
        "differentialGain",
        "Differential gain must be positive.",
        "invalid_gain",
      );
    if (!(commonModeGain > 0))
      simpleError(
        "commonModeGain",
        "Common mode gain must be positive.",
        "invalid_gain",
      );
    return {
      cmrrDb: 20 * Math.log10(differentialGain / commonModeGain),
    };
  },
});
export const runCmrrDb = cmrrDbTool.execute;
export default cmrrDbTool;
