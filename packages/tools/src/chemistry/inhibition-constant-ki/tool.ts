import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const inhibitionConstantKiTool = createSimpleTool({
  id: "chemistry/inhibition-constant-ki",
  title: "Inhibition Constant Ki Calculator",
  description: "Compute Ki from IC50 via Cheng-Prusoff Ki = IC50/(1+S/Km).",
  inputs: [
    { id: "ic50", label: "IC50", kind: "number", minimum: 0 },
    { id: "substrateS", label: "[S]", kind: "number", minimum: 0 },
    { id: "km", label: "Km", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "ki", label: "Ki", kind: "number" }],
  calculate: (input) => {
    const km = input.km as number;
    if (!(km > 0))
      simpleError("km", "Km must be greater than zero.", "invalid_km");
    const denominator = 1 + (input.substrateS as number) / km;
    return { ki: (input.ic50 as number) / denominator };
  },
});
export default inhibitionConstantKiTool;
export const runInhibitionConstantKi = inhibitionConstantKiTool.execute;

export type InhibitionConstantKiInput = {
  readonly ic50: number;
  readonly substrateS: number;
  readonly km: number;
};

export type InhibitionConstantKiOutput = {
  readonly ki: number;
};

export const inhibitionConstantKiExample = {
  input: {
    ic50: 1,
    substrateS: 1,
    km: 1,
  },
  output: {
    ki: 0.5,
  },
} satisfies ToolExample<InhibitionConstantKiInput, InhibitionConstantKiOutput>;
