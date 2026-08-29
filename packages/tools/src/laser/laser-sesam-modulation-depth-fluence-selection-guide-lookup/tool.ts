import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SesamGuideInput = {
  readonly modulationDepthPercent: number;
  readonly nonsaturableLossPercent: number;
  readonly saturationFluenceUJPerCm2: number;
  readonly intracavityFluenceUJPerCm2: number;
  readonly damageThresholdUJPerCm2: number;
};

export type SesamGuideOutput = {
  readonly saturationRatio: number;
  readonly lossMarginPercent: number;
  readonly reachesSaturationFluence: boolean;
  readonly belowDamageThreshold: boolean;
  readonly guidanceNote: string;
};

/** Compare candidate datasheet values with the expected intracavity fluence. */
export const sesamGuide = (input: SesamGuideInput): SesamGuideOutput => {
  const {
    modulationDepthPercent,
    nonsaturableLossPercent,
    saturationFluenceUJPerCm2,
    intracavityFluenceUJPerCm2,
    damageThresholdUJPerCm2,
  } = input;
  if (!Number.isFinite(modulationDepthPercent) || modulationDepthPercent <= 0)
    simpleError("modulationDepthPercent", "Modulation depth must be positive.");
  if (!Number.isFinite(nonsaturableLossPercent) || nonsaturableLossPercent < 0)
    simpleError(
      "nonsaturableLossPercent",
      "Nonsaturable loss must be finite and non-negative.",
    );
  if (
    !Number.isFinite(saturationFluenceUJPerCm2) ||
    saturationFluenceUJPerCm2 <= 0
  )
    simpleError(
      "saturationFluenceUJPerCm2",
      "Saturation fluence must be positive.",
    );
  if (
    !Number.isFinite(intracavityFluenceUJPerCm2) ||
    intracavityFluenceUJPerCm2 < 0
  )
    simpleError(
      "intracavityFluenceUJPerCm2",
      "Intracavity fluence must be finite and non-negative.",
    );
  if (!Number.isFinite(damageThresholdUJPerCm2) || damageThresholdUJPerCm2 <= 0)
    simpleError(
      "damageThresholdUJPerCm2",
      "Damage threshold must be positive.",
    );

  const saturationRatio =
    intracavityFluenceUJPerCm2 / saturationFluenceUJPerCm2;
  return {
    saturationRatio,
    lossMarginPercent: modulationDepthPercent - nonsaturableLossPercent,
    reachesSaturationFluence: saturationRatio >= 1,
    belowDamageThreshold: intracavityFluenceUJPerCm2 < damageThresholdUJPerCm2,
    guidanceNote:
      "Use these ratios as screening checks only; recovery time, wavelength, beam profile, roll-over, tolerances, and the vendor's damage-test conditions also affect selection.",
  };
};

export const sesamGuideExample = {
  input: {
    modulationDepthPercent: 1.5,
    nonsaturableLossPercent: 0.5,
    saturationFluenceUJPerCm2: 50,
    intracavityFluenceUJPerCm2: 75,
    damageThresholdUJPerCm2: 500,
  },
  output: {
    saturationRatio: 1.5,
    lossMarginPercent: 1,
    reachesSaturationFluence: true,
    belowDamageThreshold: true,
    guidanceNote:
      "Use these ratios as screening checks only; recovery time, wavelength, beam profile, roll-over, tolerances, and the vendor's damage-test conditions also affect selection.",
  },
} satisfies ToolExample<SesamGuideInput, SesamGuideOutput>;

export const sesamGuideTool = createSimpleTool({
  calculate: (input) =>
    sesamGuide({
      damageThresholdUJPerCm2: input.damageThresholdUJPerCm2 as number,
      intracavityFluenceUJPerCm2: input.intracavityFluenceUJPerCm2 as number,
      modulationDepthPercent: input.modulationDepthPercent as number,
      nonsaturableLossPercent: input.nonsaturableLossPercent as number,
      saturationFluenceUJPerCm2: input.saturationFluenceUJPerCm2 as number,
    }),
  description:
    "Screen a SESAM candidate by comparing modulation depth, nonsaturable loss, saturation fluence, and damage threshold with expected intracavity fluence.",
  id: "laser/laser-sesam-modulation-depth-fluence-selection-guide-lookup",
  inputs: [
    {
      description: "Datasheet modulation depth ΔR.",
      id: "modulationDepthPercent",
      kind: "number",
      label: "Modulation depth",
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
    {
      description: "Datasheet nonsaturable loss.",
      id: "nonsaturableLossPercent",
      kind: "number",
      label: "Nonsaturable loss",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Datasheet saturation fluence at the operating wavelength.",
      id: "saturationFluenceUJPerCm2",
      kind: "number",
      label: "Saturation fluence",
      minimum: Number.MIN_VALUE,
      unit: "µJ/cm²",
    },
    {
      description: "Expected pulse fluence on the absorber.",
      id: "intracavityFluenceUJPerCm2",
      kind: "number",
      label: "Intracavity fluence",
      minimum: 0,
      unit: "µJ/cm²",
    },
    {
      description: "Datasheet threshold under comparable pulse conditions.",
      id: "damageThresholdUJPerCm2",
      kind: "number",
      label: "Damage threshold",
      minimum: Number.MIN_VALUE,
      unit: "µJ/cm²",
    },
  ],
  outputs: [
    {
      description: "Intracavity fluence divided by saturation fluence.",
      id: "saturationRatio",
      kind: "number",
      label: "Saturation ratio",
    },
    {
      description: "Modulation depth minus nonsaturable loss.",
      id: "lossMarginPercent",
      kind: "number",
      label: "Loss margin",
      unit: "%",
    },
    {
      description: "Whether intracavity fluence reaches saturation fluence.",
      id: "reachesSaturationFluence",
      kind: "boolean",
      label: "Reaches saturation",
    },
    {
      description: "Whether intracavity fluence is below the stated threshold.",
      id: "belowDamageThreshold",
      kind: "boolean",
      label: "Below damage threshold",
    },
    {
      description: "Limits of this screening comparison.",
      id: "guidanceNote",
      kind: "string",
      label: "Guidance",
    },
  ],
  title: "SESAM Selection Checks",
});
export const runSesamGuide = sesamGuideTool.execute;
export default sesamGuideTool;

export { sesamGuideExample as example };
