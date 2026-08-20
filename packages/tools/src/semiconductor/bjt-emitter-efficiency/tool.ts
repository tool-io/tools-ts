import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type EmitterEfficiencyInput = {
  readonly baseDopingPerCm3: number;
  readonly baseWidthUm: number;
  readonly emitterDiffusionLengthUm: number;
  readonly emitterDopingPerCm3: number;
};

export type EmitterEfficiencyOutput = {
  readonly gamma: number;
};

export const emitterEfficiencyExample = {
  input: {
    baseDopingPerCm3: 1e16,
    baseWidthUm: 0.5,
    emitterDiffusionLengthUm: 2,
    emitterDopingPerCm3: 1e19,
  },
  output: { gamma: 0.999750062484 },
} satisfies ToolExample<EmitterEfficiencyInput, EmitterEfficiencyOutput>;

/**
 * Assumes equal diffusion coefficients on both sides (documented model),
 * so the Gummel ratio reduces to the doping-and-width term.
 */
export const calculateEmitterEfficiency = (
  input: EmitterEfficiencyInput,
): EmitterEfficiencyOutput => {
  for (const [field, value] of [
    ["baseDopingPerCm3", input.baseDopingPerCm3],
    ["emitterDopingPerCm3", input.emitterDopingPerCm3],
    ["baseWidthUm", input.baseWidthUm],
    ["emitterDiffusionLengthUm", input.emitterDiffusionLengthUm],
  ] as const)
    if (value <= 0)
      simpleError(field, "All inputs must be positive.", "invalid_input");
  const gummelRatio =
    (input.baseDopingPerCm3 * input.baseWidthUm) /
    (input.emitterDopingPerCm3 * input.emitterDiffusionLengthUm);
  return { gamma: roundStatistic(1 / (1 + gummelRatio)) };
};

export const emitterEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculateEmitterEfficiency(input as unknown as EmitterEfficiencyInput),
  description:
    "Compute the BJT emitter injection efficiency assuming equal diffusion coefficients on both sides.",
  id: "semiconductor/bjt-emitter-efficiency",
  inputs: [
    {
      description: "Base doping concentration.",
      format: "density-per-cm3",
      id: "baseDopingPerCm3",
      kind: "number",
      label: "Base doping",
      unit: "cm^-3",
    },
    {
      description: "Neutral base width.",
      id: "baseWidthUm",
      kind: "number",
      label: "Base width",
      unit: "µm",
    },
    {
      description: "Emitter doping concentration.",
      format: "density-per-cm3",
      id: "emitterDopingPerCm3",
      kind: "number",
      label: "Emitter doping",
      unit: "cm^-3",
    },
    {
      description: "Minority-carrier diffusion length in the emitter.",
      id: "emitterDiffusionLengthUm",
      kind: "number",
      label: "Emitter length",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of emitter current carried by carriers injected into the base.",
      format: "probability",
      id: "gamma",
      kind: "number",
      label: "Gamma",
    },
  ],
  title: "BJT Emitter Efficiency Calculator",
});
export const runEmitterEfficiency = emitterEfficiencyTool.execute;
export default emitterEfficiencyTool;
