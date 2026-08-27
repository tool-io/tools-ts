import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonModeRejectionRatioLinearInput = {
  readonly differentialGain: number;
  readonly commonModeGain: number;
};

export type CommonModeRejectionRatioLinearOutput = {
  readonly cmrrLinear: number;
};

export const commonModeRejectionRatioLinearExample = {
  input: { differentialGain: 100000, commonModeGain: 10 },
  output: { cmrrLinear: 10000 },
} satisfies ToolExample<
  CommonModeRejectionRatioLinearInput,
  CommonModeRejectionRatioLinearOutput
>;

export const commonModeRejectionRatioLinearTool = createSimpleTool({
  id: "electronics/common-mode-rejection-ratio-linear",
  title: "CMRR Linear",
  description:
    "Compute the linear common-mode rejection ratio as Adiff / Acm; the common-mode gain must not be zero.",
  inputs: [
    { id: "differentialGain", label: "Differential gain", kind: "number" },
    { id: "commonModeGain", label: "Common mode gain", kind: "number" },
  ],
  outputs: [{ id: "cmrrLinear", label: "CMRR", kind: "number", unit: "ratio" }],
  calculate: (input) => {
    const differentialGain = input.differentialGain as number;
    const commonModeGain = input.commonModeGain as number;
    if (commonModeGain === 0)
      simpleError(
        "commonModeGain",
        "Common mode gain must not be zero.",
        "degenerate_input",
      );
    return {
      cmrrLinear: differentialGain / commonModeGain,
    };
  },
});
export const runCommonModeRejectionRatioLinear =
  commonModeRejectionRatioLinearTool.execute;
export default commonModeRejectionRatioLinearTool;
