import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TwoWineAbvBlendInput = {
  readonly abvAPercent: number;
  readonly abvBPercent: number;
  readonly volumeALiters: number;
  readonly volumeBLiters: number;
};

export type TwoWineAbvBlendOutput = {
  readonly blendedAbvPercent: number;
};

export const twoWineAbvBlendExample = {
  input: {
    abvAPercent: 13,
    abvBPercent: 14,
    volumeALiters: 500,
    volumeBLiters: 700,
  },
  output: {
    blendedAbvPercent: 13.5833333333,
  },
} satisfies ToolExample<TwoWineAbvBlendInput, TwoWineAbvBlendOutput>;

export const calculateTwoWineAbvBlend = (
  input: TwoWineAbvBlendInput,
): TwoWineAbvBlendOutput => {
  const totalVolume = input.volumeALiters + input.volumeBLiters;
  if (totalVolume <= 0)
    simpleError(
      "volumeALiters",
      "The blended volume must be positive.",
      "invalid_value",
    );
  return {
    blendedAbvPercent: roundStatistic(
      (input.volumeALiters * input.abvAPercent +
        input.volumeBLiters * input.abvBPercent) /
        totalVolume,
    ),
  };
};

export const twoWineAbvBlendTool = createSimpleTool({
  calculate: (input) =>
    calculateTwoWineAbvBlend(input as unknown as TwoWineAbvBlendInput),
  description:
    "Compute the alcohol by volume of blending two wines from their volumes and strengths.",
  id: "oenology/two-wine-abv-blend",
  inputs: [
    {
      description: "Alcohol of wine A.",
      id: "abvAPercent",
      kind: "number",
      label: "ABV of A",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Alcohol of wine B.",
      id: "abvBPercent",
      kind: "number",
      label: "ABV of B",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Volume of wine A.",
      id: "volumeALiters",
      kind: "number",
      label: "Volume of A",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Volume of wine B.",
      id: "volumeBLiters",
      kind: "number",
      label: "Volume of B",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Volume-weighted alcohol of the blend.",
      id: "blendedAbvPercent",
      kind: "number",
      label: "Blended ABV",
      unit: "%",
    },
  ],
  title: "Two-Wine ABV Blend Result Calculator",
});
export const runTwoWineAbvBlend = twoWineAbvBlendTool.execute;
export default twoWineAbvBlendTool;
