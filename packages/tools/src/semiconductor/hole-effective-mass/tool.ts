import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HoleEffectiveMassInput = {
  readonly heavyMassRatioX?: number;
  readonly lightMassRatioX?: number;
};

export type HoleEffectiveMassOutput = {
  readonly dosMassRatioX: number;
};

export const holeEffectiveMassExample = {
  input: { heavyMassRatioX: 0.49, lightMassRatioX: 0.16 },
  output: { dosMassRatioX: 0.549198833534467 },
} satisfies ToolExample<HoleEffectiveMassInput, HoleEffectiveMassOutput>;

export const calculateHoleEffectiveMass = (
  input: HoleEffectiveMassInput,
): HoleEffectiveMassOutput => {
  const heavy = input.heavyMassRatioX ?? 1;
  const light = input.lightMassRatioX ?? heavy;
  if (heavy <= 0 || light <= 0)
    simpleError(
      "heavyMassRatioX",
      "Effective masses must be positive.",
      "invalid_mass",
    );
  const dos =
    (heavy ** 1.5 + light ** 1.5) ** (2 / 3);
  return { dosMassRatioX: dos };
};

export const holeEffectiveMassTool = createSimpleTool({
  calculate: (input) =>
    calculateHoleEffectiveMass(input as unknown as HoleEffectiveMassInput),
  description:
    "Combine heavy- and light-hole masses into a density-of-states hole mass.",
  id: "semiconductor/hole-effective-mass",
  inputs: [
    {
      description: "Heavy-hole effective mass ratio mhh*/m0.",
      id: "heavyMassRatioX",
      kind: "number",
      label: "mhh*/m0",
      required: false,
    },
    {
      description:
        "Light-hole effective mass ratio mlh*/m0; defaults to the heavy value.",
      id: "lightMassRatioX",
      kind: "number",
      label: "mlh*/m0",
      required: false,
    },
  ],
  outputs: [
    {
      description: "Density-of-states hole mass ratio mdos*/m0.",
      id: "dosMassRatioX",
      kind: "number",
      label: "mdos*/m0",
    },
  ],
  title: "Hole Effective Mass Calculator",
});
export const runHoleEffectiveMass = holeEffectiveMassTool.execute;
export default holeEffectiveMassTool;
