import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RedoxNormalityInput = {
  readonly electronChangeInt: number;
  readonly molarityM: number;
};

export type RedoxNormalityOutput = {
  readonly normality: number;
};

export const redoxNormalityExample = {
  input: { molarityM: 0.1, electronChangeInt: 2 },
  output: { normality: 0.2 },
} satisfies ToolExample<RedoxNormalityInput, RedoxNormalityOutput>;

export const redoxNormalityTool = createSimpleTool({
  id: "chemistry/redox-normality",
  title: "Redox Normality",
  description:
    "Compute redox normality as molarity times the number of electrons transferred per formula unit.",
  inputs: [
    { id: "molarityM", label: "Molarity", kind: "number", unit: "M" },
    {
      id: "electronChangeInt",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "normality", label: "Normality", kind: "number", unit: "eq/L" },
  ],
  calculate: (input) => {
    const molarityM = input.molarityM as number;
    if (!(molarityM > 0))
      simpleError(
        "molarityM",
        "Molarity must be positive.",
        "invalid_molarity",
      );
    return { normality: molarityM * (input.electronChangeInt as number) };
  },
});
export const runRedoxNormality = redoxNormalityTool.execute;
export default redoxNormalityTool;
