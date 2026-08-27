import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveStressInput = {
  readonly porePressureKpa: number;
  readonly totalStressKpa: number;
};

export type EffectiveStressOutput = {
  readonly effectiveStressKpa: number;
};

export const calculateEffectiveStress = (
  input: EffectiveStressInput,
): EffectiveStressOutput => {
  if (!(input.totalStressKpa >= 0))
    simpleError(
      "totalStressKpa",
      "Total stress cannot be negative.",
      "invalid_stress",
    );
  if (!(input.porePressureKpa >= 0))
    simpleError(
      "porePressureKpa",
      "Pore water pressure cannot be negative.",
      "invalid_stress",
    );
  return {
    effectiveStressKpa: input.totalStressKpa - input.porePressureKpa,
  };
};

export const effectiveStressExample = {
  input: { porePressureKpa: 98.1, totalStressKpa: 250 },
  output: { effectiveStressKpa: 151.9 },
} satisfies ToolExample<EffectiveStressInput, EffectiveStressOutput>;

export const effectiveStressTool = createSimpleTool({
  id: "geology/effective-stress",
  title: "Effective Stress Calculator",
  description:
    "Compute Terzaghi effective stress as the total vertical stress minus the pore water pressure, both in kPa.",
  inputs: [
    {
      description: "Total (normal) stress in kilopascals.",
      id: "totalStressKpa",
      kind: "number",
      label: "Total stress",
      minimum: 0,
    },
    {
      description: "Pore water pressure in kilopascals.",
      id: "porePressureKpa",
      kind: "number",
      label: "Pore pressure",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Effective stress in kilopascals.",
      id: "effectiveStressKpa",
      kind: "number",
      label: "Effective stress",
    },
  ],
  calculate: (input) =>
    calculateEffectiveStress(input as unknown as EffectiveStressInput),
});

export const runEffectiveStress = effectiveStressTool.execute;
export default effectiveStressTool;
