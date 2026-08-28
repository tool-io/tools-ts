import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const GammaCpCvTool = createSimpleTool({
  id: "chemistry/gamma-cp-cv",
  title: "Gamma Cp/Cv Calculator",
  description: "Compute heat capacity ratio gamma = Cp/Cv.",
  inputs: [
    { id: "cp", label: "Cp", kind: "number", minimum: 0 },
    { id: "cv", label: "Cv", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "gamma", label: "Gamma", kind: "number" }],
  calculate: (input) => {
    if (!((input.cp as number) > 0))
      simpleError("cp", "Cp must be greater than zero.", "invalid_cp");
    if (!((input.cv as number) > 0))
      simpleError("cv", "Cv must be greater than zero.", "invalid_cv");
    return { gamma: (input.cp as number) / (input.cv as number) };
  },
});
export default GammaCpCvTool;
export const runGammaCpCv = GammaCpCvTool.execute;

export type GammaCpCvInput = {
  readonly cp: number;
  readonly cv: number;
};

export type GammaCpCvOutput = {
  readonly gamma: number;
};

export const gammaCpCvExample = {
  input: {
    cp: 1,
    cv: 1,
  },
  output: {
    gamma: 1,
  },
} satisfies ToolExample<GammaCpCvInput, GammaCpCvOutput>;
