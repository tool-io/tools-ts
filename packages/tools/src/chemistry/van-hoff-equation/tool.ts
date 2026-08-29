import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const VanHoffEquationTool = createSimpleTool({
  id: "chemistry/van-hoff-equation",
  title: "Van't Hoff Equation Calculator",
  description: "Solve for K2 using ln(K2/K1) = -dH/R(1/T2-1/T1).",
  inputs: [
    { id: "k1", label: "K1", kind: "number", minimum: 0 },
    { id: "temperature1K", label: "T1", kind: "number", minimum: 0, unit: "K" },
    { id: "temperature2K", label: "T2", kind: "number", minimum: 0, unit: "K" },
    { id: "deltaHJPerMol", label: "dH", kind: "number", unit: "J/mol" },
  ],
  outputs: [{ id: "k2", label: "K2", kind: "number" }],
  calculate: (input) => {
    const t1 = input.temperature1K as number;
    const t2 = input.temperature2K as number;
    const k1v = input.k1 as number;
    if (t1 <= 0 || t2 <= 0 || k1v <= 0)
      simpleError("k1", "> 0 required.", "invalid_input");
    return {
      k2:
        k1v *
        Math.exp(
          -((input.deltaHJPerMol as number) / 8.314) * (1 / t2 - 1 / t1),
        ),
    };
  },
});
export default VanHoffEquationTool;
export const runVanHoffEquation = VanHoffEquationTool.execute;

export type VanHoffEquationInput = {
  readonly k1: number;
  readonly temperature1K: number;
  readonly temperature2K: number;
  readonly deltaHJPerMol: number;
};

export type VanHoffEquationOutput = {
  readonly k2: number;
};

export const vanHoffEquationExample = {
  input: {
    k1: 1,
    temperature1K: 1,
    temperature2K: 1,
    deltaHJPerMol: 1,
  },
  output: {
    k2: 1,
  },
} satisfies ToolExample<VanHoffEquationInput, VanHoffEquationOutput>;
