import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UniformityCoefficientInput = {
  readonly d60Mm: number;
  readonly d10Mm: number;
};

export type UniformityCoefficientOutput = {
  readonly uniformityCoefficient: number;
};

export const calculateUniformityCoefficient = (
  input: UniformityCoefficientInput,
): UniformityCoefficientOutput => {
  if (!(input.d60Mm > 0))
    simpleError(
      "d60Mm",
      "D60 must be greater than zero.",
      "invalid_grain_size",
    );
  if (!(input.d10Mm > 0))
    simpleError(
      "d10Mm",
      "D10 must be greater than zero.",
      "invalid_grain_size",
    );
  return { uniformityCoefficient: input.d60Mm / input.d10Mm };
};

export const uniformityCoefficientExample = {
  input: { d60Mm: 0.85, d10Mm: 0.15 },
  output: { uniformityCoefficient: 5.666666666666667 },
} satisfies ToolExample<
  UniformityCoefficientInput,
  UniformityCoefficientOutput
>;

export const uniformityCoefficientTool = createSimpleTool({
  id: "geology/uniformity-coefficient",
  title: "Uniformity Coefficient Calculator",
  description:
    "Compute the uniformity coefficient Cu = D60 / D10 from grain sizes in millimeters read from a gradation curve.",
  inputs: [
    {
      description: "Sieve size at 60 percent finer in millimeters.",
      id: "d60Mm",
      kind: "number",
      label: "D60",
    },
    {
      description:
        "Sieve size at 10 percent finer (effective size) in millimeters.",
      id: "d10Mm",
      kind: "number",
      label: "D10",
    },
  ],
  outputs: [
    {
      description: "Uniformity coefficient Cu (dimensionless).",
      id: "uniformityCoefficient",
      kind: "number",
      label: "Cu",
    },
  ],
  calculate: (input) =>
    calculateUniformityCoefficient(
      input as unknown as UniformityCoefficientInput,
    ),
});

export const runUniformityCoefficient = uniformityCoefficientTool.execute;
export default uniformityCoefficientTool;
