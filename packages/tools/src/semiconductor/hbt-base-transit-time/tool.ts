import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HbtBaseTransitTimeInput = {
  readonly baseDiffusionCoefficientCm2PerS: number;
  readonly baseWidthUm: number;
};

export type HbtBaseTransitTimeOutput = {
  readonly transitTimePs: number;
};

export const hbtBaseTransitTimeExample = {
  input: { baseDiffusionCoefficientCm2PerS: 25, baseWidthUm: 0.5 },
  output: { transitTimePs: 50 },
} satisfies ToolExample<HbtBaseTransitTimeInput, HbtBaseTransitTimeOutput>;

export const calculateHbtBaseTransitTime = (
  input: HbtBaseTransitTimeInput,
): HbtBaseTransitTimeOutput => {
  if (!Number.isFinite(input.baseWidthUm) || input.baseWidthUm <= 0)
    simpleError("baseWidthUm", "Base width must be positive.");
  if (
    !Number.isFinite(input.baseDiffusionCoefficientCm2PerS) ||
    input.baseDiffusionCoefficientCm2PerS <= 0
  )
    simpleError(
      "baseDiffusionCoefficientCm2PerS",
      "Base diffusion coefficient must be positive.",
    );
  const widthCm = input.baseWidthUm * 1e-4;
  const direct =
    ((widthCm * widthCm) / (2 * input.baseDiffusionCoefficientCm2PerS)) * 1e12;
  const transitTimePs =
    Number.isFinite(direct) && direct > 0
      ? direct
      : Math.exp(
          2 * Math.log(input.baseWidthUm) -
            Math.log(2 * input.baseDiffusionCoefficientCm2PerS) +
            Math.log(1e4),
        );
  if (!Number.isFinite(transitTimePs) || transitTimePs <= 0)
    simpleError(
      "baseWidthUm",
      "The transit time is not representable.",
      "numeric_range",
    );
  return { transitTimePs };
};

export const hbtBaseTransitTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateHbtBaseTransitTime({
      baseDiffusionCoefficientCm2PerS:
        input.baseDiffusionCoefficientCm2PerS as number,
      baseWidthUm: input.baseWidthUm as number,
    }),
  description:
    "Compute the minority-carrier base transit time of a bipolar transistor from base width and diffusion coefficient.",
  id: "semiconductor/hbt-base-transit-time",
  inputs: [
    {
      description: "Minority-carrier diffusion coefficient in the base.",
      id: "baseDiffusionCoefficientCm2PerS",
      kind: "number",
      label: "Base diffusion coefficient",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/s",
    },
    {
      description: "Neutral base width.",
      id: "baseWidthUm",
      kind: "number",
      label: "Base width",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  outputs: [
    {
      description: "Base transit time.",
      format: "time-ps",
      id: "transitTimePs",
      kind: "number",
      label: "Transit time",
      minimum: Number.MIN_VALUE,
      unit: "ps",
    },
  ],
  title: "Base Transit Time Calculator",
});
export const runHbtBaseTransitTime = hbtBaseTransitTimeTool.execute;
export default hbtBaseTransitTimeTool;
