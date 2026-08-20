import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BaseTransportFactorInput = {
  readonly baseDiffusionLengthUm: number;
  readonly baseWidthUm: number;
};

export type BaseTransportFactorOutput = {
  readonly alphaT: number;
};

export const baseTransportFactorExample = {
  input: { baseDiffusionLengthUm: 5, baseWidthUm: 0.5 },
  output: { alphaT: 0.995 },
} satisfies ToolExample<BaseTransportFactorInput, BaseTransportFactorOutput>;

export const calculateBaseTransportFactor = (
  input: BaseTransportFactorInput,
): BaseTransportFactorOutput => {
  const { baseDiffusionLengthUm, baseWidthUm } = input;
  if (baseWidthUm <= 0 || baseDiffusionLengthUm <= 0)
    simpleError(
      "baseWidthUm",
      "Base width and diffusion length must be positive.",
      "invalid_input",
    );
  if (baseDiffusionLengthUm <= baseWidthUm)
    simpleError(
      "baseDiffusionLengthUm",
      "The diffusion length must exceed the base width.",
      "transport_invalid",
    );
  const ratio = baseWidthUm / baseDiffusionLengthUm;
  return { alphaT: 1 - (ratio * ratio) / 2 };
};

export const baseTransportFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateBaseTransportFactor(input as unknown as BaseTransportFactorInput),
  description:
    "Compute the BJT base transport factor from base width and minority-carrier diffusion length.",
  id: "semiconductor/bjt-base-transport-factor",
  inputs: [
    {
      description: "Neutral base width.",
      id: "baseWidthUm",
      kind: "number",
      label: "Base width",
      unit: "µm",
    },
    {
      description:
        "Minority-carrier diffusion length in the base; must exceed the width.",
      id: "baseDiffusionLengthUm",
      kind: "number",
      label: "Diffusion length",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of injected carriers that survive the base crossing.",
      format: "probability",
      id: "alphaT",
      kind: "number",
      label: "Alpha T",
    },
  ],
  title: "BJT Base Transport Factor Calculator",
});
export const runBaseTransportFactor = baseTransportFactorTool.execute;
export default baseTransportFactorTool;
