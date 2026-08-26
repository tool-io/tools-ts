import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StoneFaceAreaCalculatorInput = {
  readonly widthCm: number;
  readonly heightCm: number;
};

export type StoneFaceAreaCalculatorOutput = {
  readonly areaCm2: number;
  readonly areaM2: number;
};

export const calculateStoneFaceAreaCalculator = (
  input: StoneFaceAreaCalculatorInput,
): StoneFaceAreaCalculatorOutput => {
  for (const key of ["widthCm", "heightCm"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Face dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const areaCm2 = input.widthCm * input.heightCm;
  return { areaCm2, areaM2: areaCm2 / 10000 };
};

export const stoneFaceAreaCalculatorExample = {
  input: { widthCm: 120, heightCm: 80 },
  output: { areaCm2: 9600, areaM2: 0.96 },
} satisfies ToolExample<
  StoneFaceAreaCalculatorInput,
  StoneFaceAreaCalculatorOutput
>;

export const stoneFaceAreaCalculatorTool = createSimpleTool({
  id: "epigraphy/stone-face-area-calculator",
  title: "Stone Surface Area Face Dimension Calculator",
  description:
    "Compute the inscribed surface area of a stone face from its width and height in centimetres, reported in square centimetres and square metres.",
  inputs: [
    {
      description: "Face width in centimetres.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Face height in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Face area in square centimetres.",
      id: "areaCm2",
      kind: "number",
      label: "Area",
      unit: "cm²",
    },
    {
      description: "Face area in square metres.",
      id: "areaM2",
      kind: "number",
      label: "Area",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateStoneFaceAreaCalculator(
      input as unknown as StoneFaceAreaCalculatorInput,
    ),
});

export const runStoneFaceAreaCalculator = stoneFaceAreaCalculatorTool.execute;
export default stoneFaceAreaCalculatorTool;
