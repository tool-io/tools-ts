import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fugacityFromCompressibilityExample = {
  input: { compressibilityFactorZ: 0.85, pressureBar: 12.5 },
  output: { fugacityBar: 10.758849705313223 },
} satisfies ToolExample<
  {
    readonly compressibilityFactorZ: number;
    readonly pressureBar: number;
  },
  { readonly fugacityBar: number }
>;

export const fugacityFromCompressibilityTool = createSimpleTool({
  id: "chemistry/fugacity-from-compressibility",
  title: "Fugacity From Z",
  description:
    "Estimate gas fugacity from a pressure-virial compressibility factor using ln(phi) ≈ Z-1 and f = phi·P; this second-virial approximation is for low pressure.",
  inputs: [
    {
      id: "compressibilityFactorZ",
      label: "Compressibility factor Z",
      kind: "number",
    },
    { id: "pressureBar", label: "Pressure", kind: "number", unit: "bar" },
  ],
  outputs: [
    { id: "fugacityBar", label: "Fugacity", kind: "number", unit: "bar" },
  ],
  calculate: (input) => {
    const compressibilityFactorZ = input.compressibilityFactorZ as number;
    const pressureBar = input.pressureBar as number;
    if (!(compressibilityFactorZ > 0))
      simpleError(
        "compressibilityFactorZ",
        "Compressibility factor must be positive.",
      );
    if (!(pressureBar > 0))
      simpleError("pressureBar", "Pressure must be positive.");
    return {
      fugacityBar: pressureBar * Math.exp(compressibilityFactorZ - 1),
    };
  },
});
export const runFugacityFromCompressibility =
  fugacityFromCompressibilityTool.execute;
export default fugacityFromCompressibilityTool;
