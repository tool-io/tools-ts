import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MalicAcidAdditionInput = {
  readonly currentTaGPerL: number;
  readonly targetTaGPerL: number;
  readonly volumeLiters: number;
};

export type MalicAcidAdditionOutput = {
  readonly malicAcidGrams: number;
};

export const malicAcidAdditionExample = {
  input: {
    currentTaGPerL: 0.2,
    targetTaGPerL: 0.5,
    volumeLiters: 50,
  },
  output: {
    malicAcidGrams: 13.3990672885,
  },
} satisfies ToolExample<MalicAcidAdditionInput, MalicAcidAdditionOutput>;

// Malic acid is titrated as if it were tartaric: one gram of malic acid
// shifts TA by the molar-mass ratio 75.05/67.04, so grams of malic acid =
// ΔTA × volume × 67.04/75.05.
const MALIC_PER_TARTARIC = 67.04 / 75.05;

export const calculateMalicAcidAddition = (
  input: MalicAcidAdditionInput,
): MalicAcidAdditionOutput => {
  if (input.targetTaGPerL < input.currentTaGPerL)
    simpleError(
      "targetTaGPerL",
      "The target titratable acidity must be at or above the current value for an addition.",
      "invalid_target",
    );
  return {
    malicAcidGrams: roundStatistic(
      (input.targetTaGPerL - input.currentTaGPerL) *
        input.volumeLiters *
        MALIC_PER_TARTARIC,
    ),
  };
};

export const malicAcidAdditionTool = createSimpleTool({
  calculate: (input) =>
    calculateMalicAcidAddition(input as unknown as MalicAcidAdditionInput),
  description:
    "Calculate theoretical malic-acid mass for a desired TA increase reported as tartaric-acid equivalents, using the equivalent-weight ratio 67.04/75.05; confirm the post-addition TA analytically.",
  id: "oenology/malic-acid-addition",
  inputs: [
    {
      description: "Measured titratable acidity.",
      id: "currentTaGPerL",
      kind: "number",
      label: "Current TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Desired titratable acidity.",
      id: "targetTaGPerL",
      kind: "number",
      label: "Target TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Volume of must to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Malic acid to dissolve into the lot.",
      id: "malicAcidGrams",
      kind: "number",
      label: "Malic acid",
      unit: "g",
    },
  ],
  title: "Malic Acid Addition Calculator",
});
export const runMalicAcidAddition = malicAcidAdditionTool.execute;
export default malicAcidAdditionTool;
