import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PearsonSquareBlendInput = {
  readonly targetValue: number;
  readonly valueA: number;
  readonly valueB: number;
};

export type PearsonSquareBlendOutput = {
  readonly fractionOfA: number;
  readonly fractionOfB: number;
  readonly partsOfA: number;
  readonly partsOfB: number;
};

export const pearsonSquareBlendExample = {
  input: {
    targetValue: 13,
    valueA: 14,
    valueB: 12,
  },
  output: {
    fractionOfA: 0.5,
    fractionOfB: 0.5,
    partsOfA: 1,
    partsOfB: 1,
  },
} satisfies ToolExample<PearsonSquareBlendInput, PearsonSquareBlendOutput>;

export const calculatePearsonSquareBlend = (
  input: PearsonSquareBlendInput,
): PearsonSquareBlendOutput => {
  const { targetValue, valueA, valueB } = input;
  const low = Math.min(valueA, valueB);
  const high = Math.max(valueA, valueB);
  if (valueA === valueB)
    simpleError(
      "valueB",
      "Component values must differ to determine a unique Pearson-square ratio.",
      "invalid_value",
    );
  if (targetValue < low || targetValue > high)
    simpleError(
      "targetValue",
      "The target must sit between the two component values for a Pearson square blend.",
      "invalid_target",
    );
  const partsOfA = Math.abs(targetValue - valueB);
  const partsOfB = Math.abs(valueA - targetValue);
  const totalParts = partsOfA + partsOfB;
  return {
    fractionOfA: roundStatistic(partsOfA / totalParts),
    fractionOfB: roundStatistic(partsOfB / totalParts),
    partsOfA: roundStatistic(partsOfA),
    partsOfB: roundStatistic(partsOfB),
  };
};

export const pearsonSquareBlendTool = createSimpleTool({
  calculate: (input) =>
    calculatePearsonSquareBlend(input as unknown as PearsonSquareBlendInput),
  description:
    "Solve the Pearson square for the proportional parts of two wines needed to hit an intermediate value such as alcohol or Brix.",
  id: "oenology/pearson-square-blend",
  inputs: [
    {
      description: "Measured value of wine A.",
      id: "valueA",
      kind: "number",
      label: "Value of A",
    },
    {
      description: "Measured value of wine B.",
      id: "valueB",
      kind: "number",
      label: "Value of B",
    },
    {
      description: "Value wanted in the final blend.",
      id: "targetValue",
      kind: "number",
      label: "Target",
    },
  ],
  outputs: [
    {
      description: "Volume fraction contributed by component A.",
      id: "fractionOfA",
      kind: "number",
      label: "Fraction of A",
    },
    {
      description: "Volume fraction contributed by component B.",
      id: "fractionOfB",
      kind: "number",
      label: "Fraction of B",
    },
    {
      description:
        "Parts of wine A in the blend; divide both parts by their sum for volume fractions.",
      id: "partsOfA",
      kind: "number",
      label: "Parts of A",
    },
    {
      description: "Parts of wine B in the blend.",
      id: "partsOfB",
      kind: "number",
      label: "Parts of B",
    },
  ],
  title: "Blending Pearson Square Calculator",
});
export const runPearsonSquareBlend = pearsonSquareBlendTool.execute;
export default pearsonSquareBlendTool;
