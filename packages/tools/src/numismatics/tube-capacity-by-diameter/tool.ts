import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TubeCapacityByDiameterInput = Readonly<{
  readonly tubeInnerDiameterMillimeters: number;
  readonly coinDiameterMillimeters: number;
  readonly tubeInsideLengthMillimeters: number;
  readonly coinThicknessMillimeters: number;
}>;
export type TubeCapacityByDiameterOutput = Readonly<{
  readonly stackCapacityCoins: number;
}>;

export const calculateTubeCapacityByDiameter = (
  x: TubeCapacityByDiameterInput,
): TubeCapacityByDiameterOutput => {
  if (
    !Number.isFinite(x.tubeInnerDiameterMillimeters) ||
    x.tubeInnerDiameterMillimeters < 0
  )
    simpleError(
      "tubeInnerDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.coinDiameterMillimeters) ||
    x.coinDiameterMillimeters < 0
  )
    simpleError(
      "coinDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.tubeInsideLengthMillimeters) ||
    x.tubeInsideLengthMillimeters < 0
  )
    simpleError(
      "tubeInsideLengthMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.coinThicknessMillimeters) ||
    x.coinThicknessMillimeters < 0
  )
    simpleError(
      "coinThicknessMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    x.tubeInnerDiameterMillimeters <= 0 ||
    x.coinDiameterMillimeters <= 0 ||
    x.tubeInsideLengthMillimeters <= 0 ||
    x.coinThicknessMillimeters <= 0
  )
    simpleError(
      "tubeInnerDiameterMillimeters",
      "All physical dimensions must be positive.",
    );
  const stackCapacityCoins =
    x.tubeInnerDiameterMillimeters < x.coinDiameterMillimeters
      ? 0
      : Math.floor(x.tubeInsideLengthMillimeters / x.coinThicknessMillimeters);
  if (!Number.isFinite(stackCapacityCoins))
    simpleError(
      "stackCapacityCoins",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stackCapacityCoins: Object.is(stackCapacityCoins, -0)
      ? 0
      : stackCapacityCoins,
  };
};

export const example = {
  input: {
    tubeInnerDiameterMillimeters: 25,
    coinDiameterMillimeters: 20,
    tubeInsideLengthMillimeters: 100,
    coinThicknessMillimeters: 2,
  },
  output: { stackCapacityCoins: 50 },
} satisfies ToolExample<
  TubeCapacityByDiameterInput,
  TubeCapacityByDiameterOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/tube-capacity-by-diameter",
  title: "Tube Capacity By Diameter",
  description:
    "Estimate a single vertical stack's capacity from tube length and coin thickness; diameter only checks fit.",
  inputs: [
    {
      id: "tubeInnerDiameterMillimeters",
      kind: "number",
      label: "Tube Inner Diameter Millimeters",
      unit: "mm",
    },
    {
      id: "coinDiameterMillimeters",
      kind: "number",
      label: "Coin Diameter Millimeters",
      unit: "mm",
    },
    {
      id: "tubeInsideLengthMillimeters",
      kind: "number",
      label: "Tube Inside Length Millimeters",
      unit: "mm",
    },
    {
      id: "coinThicknessMillimeters",
      kind: "number",
      label: "Coin Thickness Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "stackCapacityCoins",
      kind: "number",
      label: "Stack Capacity Coins",
      unit: "coins",
    },
  ],
  calculate: (input) =>
    calculateTubeCapacityByDiameter({
      tubeInnerDiameterMillimeters:
        input.tubeInnerDiameterMillimeters as number,
      coinDiameterMillimeters: input.coinDiameterMillimeters as number,
      tubeInsideLengthMillimeters: input.tubeInsideLengthMillimeters as number,
      coinThicknessMillimeters: input.coinThicknessMillimeters as number,
    }),
});
export const runTubeCapacityByDiameter = tool.execute;
export default tool;
