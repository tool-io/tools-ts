import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectronEffectiveMassInput = {
  readonly longitudinalMassRatioX: number;
  readonly transverseMassRatioX: number;
  readonly valleyCount?: number;
};

export type ElectronEffectiveMassOutput = {
  readonly dosMassRatioX: number;
};

export const electronEffectiveMassExample = {
  input: {
    longitudinalMassRatioX: 0.98,
    transverseMassRatioX: 0.19,
    valleyCount: 6,
  },
  output: { dosMassRatioX: 1.0839566800496656 },
} satisfies ToolExample<ElectronEffectiveMassInput, ElectronEffectiveMassOutput>;

/**
 * Multi-valley density-of-states mass:
 * mdos = (M^2 * ml * mt^2)^(1/3), the standard silicon formula.
 */
export const calculateElectronEffectiveMass = (
  input: ElectronEffectiveMassInput,
): ElectronEffectiveMassOutput => {
  const valleyCount = input.valleyCount ?? 1;
  if (valleyCount < 1 || !Number.isInteger(valleyCount))
    simpleError(
      "valleyCount",
      "The valley count must be a positive integer.",
      "invalid_valleys",
    );
  if (input.longitudinalMassRatioX <= 0 || input.transverseMassRatioX <= 0)
    simpleError(
      "longitudinalMassRatioX",
      "Effective masses must be positive.",
      "invalid_mass",
    );
  const dosMass =
    (valleyCount ** 2 *
      input.longitudinalMassRatioX *
      input.transverseMassRatioX ** 2) ** (1 / 3);
  return { dosMassRatioX: dosMass };
};

export const electronEffectiveMassTool = createSimpleTool({
  calculate: (input) =>
    calculateElectronEffectiveMass(
      input as unknown as ElectronEffectiveMassInput,
    ),
  description:
    "Combine longitudinal and transverse effective masses into a multi-valley density-of-states electron mass.",
  id: "semiconductor/electron-effective-mass",
  inputs: [
    {
      description: "Longitudinal effective mass ratio ml*/m0.",
      id: "longitudinalMassRatioX",
      kind: "number",
      label: "ml*/m0",
    },
    {
      description: "Transverse effective mass ratio mt*/m0.",
      id: "transverseMassRatioX",
      kind: "number",
      label: "mt*/m0",
    },
    {
      default: 1,
      description:
        "Number of equivalent valleys; six for conduction-band silicon.",
      id: "valleyCount",
      kind: "integer",
      label: "Valleys",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Density-of-states effective mass ratio mdos*/m0.",
      id: "dosMassRatioX",
      kind: "number",
      label: "mdos*/m0",
    },
  ],
  title: "Electron Effective Mass Calculator",
});
export const runElectronEffectiveMass = electronEffectiveMassTool.execute;
export default electronEffectiveMassTool;
