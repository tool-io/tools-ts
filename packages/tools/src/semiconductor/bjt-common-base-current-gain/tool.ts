import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  calculateBaseTransportFactor,
} from "../bjt-base-transport-factor/tool.js";
import {
  calculateEmitterEfficiency,
} from "../bjt-emitter-efficiency/tool.js";

export type CommonBaseCurrentGainInput = {
  readonly baseDiffusionLengthUm: number;
  readonly baseDopingPerCm3: number;
  readonly baseWidthUm: number;
  readonly emitterDiffusionLengthUm: number;
  readonly emitterDopingPerCm3: number;
};

export type CommonBaseCurrentGainOutput = {
  readonly alpha: number;
};

export const commonBaseCurrentGainExample = {
  input: {
    baseDiffusionLengthUm: 5,
    baseDopingPerCm3: 1e16,
    baseWidthUm: 0.5,
    emitterDiffusionLengthUm: 2,
    emitterDopingPerCm3: 1e19,
  },
  output: { alpha: 0.994751312172 },
} satisfies ToolExample<
  CommonBaseCurrentGainInput,
  CommonBaseCurrentGainOutput
>;

export const calculateCommonBaseCurrentGain = (
  input: CommonBaseCurrentGainInput,
): CommonBaseCurrentGainOutput => {
  const transport = calculateBaseTransportFactor({
    baseDiffusionLengthUm: input.baseDiffusionLengthUm,
    baseWidthUm: input.baseWidthUm,
  });
  const efficiency = calculateEmitterEfficiency({
    baseDopingPerCm3: input.baseDopingPerCm3,
    baseWidthUm: input.baseWidthUm,
    emitterDiffusionLengthUm: input.emitterDiffusionLengthUm,
    emitterDopingPerCm3: input.emitterDopingPerCm3,
  });
  return { alpha: roundStatistic(transport.alphaT * efficiency.gamma) };
};

export const commonBaseCurrentGainTool = createSimpleTool({
  calculate: (input) =>
    calculateCommonBaseCurrentGain(
      input as unknown as CommonBaseCurrentGainInput,
    ),
  description:
    "Compute the BJT common-base current gain alpha as the product of emitter efficiency and base transport factor.",
  id: "semiconductor/bjt-common-base-current-gain",
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
    {
      description:
        "Minority-carrier diffusion length in the base; must exceed the width.",
      id: "baseDiffusionLengthUm",
      kind: "number",
      label: "Base diffusion length",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Common-base current gain, just below one.",
      format: "gain",
      id: "alpha",
      kind: "number",
      label: "Alpha",
    },
  ],
  title: "BJT Common-Base Current Gain Calculator",
});
export const runCommonBaseCurrentGain = commonBaseCurrentGainTool.execute;
export default commonBaseCurrentGainTool;
