import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MyersBlendedSexRatioIndexInput = {
  readonly maleBySingleAge: readonly number[];
  readonly femaleBySingleAge: readonly number[];
  readonly minimumAge?: number;
};

export type MyersBlendedSexRatioIndexOutput = {
  readonly myersSexRatioIndex: number;
  readonly blendedSexRatios: number[];
};

const blendedDigitTotals = (
  counts: readonly number[],
  minimumAge: number,
): number[] => {
  const blended = new Array<number>(10).fill(0);
  for (let shift = 0; shift <= 9; shift += 1) {
    const sums = new Array<number>(10).fill(0);
    for (let index = shift; index < counts.length; index += 1)
      sums[(minimumAge + index) % 10] += counts[index] as number;
    for (let digit = 0; digit <= 9; digit += 1) blended[digit] += sums[digit];
  }
  return blended.map((total) => total / 10);
};

export const calculateMyersBlendedSexRatioIndex = (
  input: MyersBlendedSexRatioIndexInput,
): MyersBlendedSexRatioIndexOutput => {
  const males = input.maleBySingleAge;
  const females = input.femaleBySingleAge;
  const minimumAge = input.minimumAge ?? 20;
  if (males.length !== females.length)
    return simpleError(
      "femaleBySingleAge",
      "Male and female lists must have the same length.",
      "invalid_list",
    );
  if (males.length < 10)
    return simpleError(
      "maleBySingleAge",
      "Myers blending needs at least ten single ages of data.",
      "invalid_list",
    );
  if (!(Number.isSafeInteger(minimumAge) && minimumAge >= 0))
    return simpleError(
      "minimumAge",
      "The minimum age must be a non-negative integer.",
      "invalid_age",
    );
  for (const key of ["maleBySingleAge", "femaleBySingleAge"] as const)
    for (const value of input[key])
      if (!(value >= 0))
        return simpleError(
          key,
          "Population counts must be non-negative.",
          "invalid_list",
        );
  const blendedMales = blendedDigitTotals(males, minimumAge);
  const blendedFemales = blendedDigitTotals(females, minimumAge);
  const blendedSexRatios: number[] = [];
  let myersSexRatioIndex = 0;
  for (let digit = 0; digit <= 9; digit += 1) {
    const femaleTotal = blendedFemales[digit] as number;
    if (!(femaleTotal > 0))
      return simpleError(
        "femaleBySingleAge",
        "Every terminal digit needs at least one female observation to form a blended sex ratio.",
        "invalid_list",
      );
    const ratio = (100 * (blendedMales[digit] as number)) / femaleTotal;
    blendedSexRatios.push(ratio);
    myersSexRatioIndex += Math.abs(ratio - 100);
  }
  return { myersSexRatioIndex, blendedSexRatios };
};

export const myersBlendedSexRatioIndexExample = {
  input: {
    maleBySingleAge: [
      520, 540, 560, 585, 610, 640, 668, 700, 735, 770, 810, 850, 895, 940, 990,
    ],
    femaleBySingleAge: [
      500, 518, 536, 556, 576, 598, 620, 644, 668, 694, 720, 748, 776, 806, 838,
    ],
    minimumAge: 30,
  },
  output: {
    myersSexRatioIndex: 111.52231661672126,
    blendedSexRatios: [
      111.94805194805195, 112.49412869891968, 113.47139197267293,
      114.15791520809023, 115.0088809946714, 107.02341137123746,
      107.74193548387096, 108.69565217391303, 110.02994011976047,
      110.95100864553314,
    ],
  },
} satisfies ToolExample<
  MyersBlendedSexRatioIndexInput,
  MyersBlendedSexRatioIndexOutput
>;

export const myersBlendedSexRatioIndexTool = createSimpleTool({
  id: "demography/myers-blended-sex-ratio-index",
  title: "Myers Blended Sex Ratio Index Calculator",
  description:
    "Compute Myers' blended index of sex ratios, the sum over terminal digits 0-9 of absolute deviations of blended sex ratios from 100, using overlapping age windows to remove digit-weighting bias.",
  inputs: [
    {
      description:
        "Males at each single year of age starting with the minimum age.",
      id: "maleBySingleAge",
      kind: "numberList",
      label: "Males",
    },
    {
      description:
        "Females at each single year of age, aligned with the males.",
      id: "femaleBySingleAge",
      kind: "numberList",
      label: "Females",
    },
    {
      default: 20,
      description: "Age of the first entry in both lists.",
      id: "minimumAge",
      kind: "integer",
      label: "Start age",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Sum of |blended sex ratio - 100| across terminal digits; zero is ideal.",
      id: "myersSexRatioIndex",
      kind: "number",
      label: "Myers index",
    },
    {
      description: "Blended sex ratio for each terminal digit 0 through 9.",
      id: "blendedSexRatios",
      kind: "numberList",
      label: "Blended SR",
    },
  ],
  calculate: (input) =>
    calculateMyersBlendedSexRatioIndex(
      input as unknown as MyersBlendedSexRatioIndexInput,
    ),
});

export const runMyersBlendedSexRatioIndex =
  myersBlendedSexRatioIndexTool.execute;
export default myersBlendedSexRatioIndexTool;
