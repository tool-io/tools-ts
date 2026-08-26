import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BachiAgeSexAccuracyInput = {
  readonly maleBySingleAge: readonly number[];
  readonly femaleBySingleAge: readonly number[];
  readonly startAge?: number;
};

export type BachiAgeSexAccuracyOutput = {
  readonly bachiAgeSexAccuracyIndex: number;
  readonly maleComponent: number;
  readonly femaleComponent: number;
};

const sexDigitPreferenceIndex = (
  counts: readonly number[],
  startAge: number,
): number => {
  let total = 0;
  for (const count of counts) total += count;
  const digitTotals = new Array<number>(10).fill(0);
  for (let index = 0; index < counts.length; index += 1)
    digitTotals[(startAge + index) % 10] += counts[index] as number;
  let absoluteDeviation = 0;
  for (let digit = 0; digit <= 9; digit += 1)
    absoluteDeviation += Math.abs(
      (100 * (digitTotals[digit] as number)) / total - 10,
    );
  return absoluteDeviation / 2;
};

export const calculateBachiAgeSexAccuracy = (
  input: BachiAgeSexAccuracyInput,
): BachiAgeSexAccuracyOutput => {
  const males = input.maleBySingleAge;
  const females = input.femaleBySingleAge;
  const startAge = input.startAge ?? 20;
  if (males.length !== females.length)
    return simpleError(
      "femaleBySingleAge",
      "Male and female lists must have the same length.",
      "invalid_list",
    );
  if (males.length < 10 || males.length % 10 !== 0)
    return simpleError(
      "maleBySingleAge",
      "Bachi's method needs a whole number of complete ten-year age blocks.",
      "invalid_list",
    );
  if (!(Number.isSafeInteger(startAge) && startAge >= 0))
    return simpleError(
      "startAge",
      "The starting age must be a non-negative integer.",
      "invalid_age",
    );
  for (const key of ["maleBySingleAge", "femaleBySingleAge"] as const) {
    for (const value of input[key])
      if (!(value >= 0))
        return simpleError(
          key,
          "Population counts must be non-negative.",
          "invalid_list",
        );
  }
  let maleTotal = 0;
  for (const count of males) maleTotal += count;
  let femaleTotal = 0;
  for (const count of females) femaleTotal += count;
  if (!(maleTotal > 0 && femaleTotal > 0))
    return simpleError(
      "maleBySingleAge",
      "Both the male and female populations must be positive.",
      "invalid_list",
    );
  const maleComponent = sexDigitPreferenceIndex(males, startAge);
  const femaleComponent = sexDigitPreferenceIndex(females, startAge);
  return {
    bachiAgeSexAccuracyIndex: maleComponent + femaleComponent,
    maleComponent,
    femaleComponent,
  };
};

export const bachiAgeSexAccuracyExample = {
  input: {
    maleBySingleAge: [
      500, 505, 512, 520, 528, 537, 547, 558, 570, 583, 597, 612, 628, 645, 663,
      682, 702, 723, 745, 768, 792, 817, 843, 870, 898, 927, 957, 988, 1020,
      1053,
    ],
    femaleBySingleAge: [
      485, 489, 494, 499, 505, 511, 518, 525, 533, 541, 550, 560, 570, 581, 593,
      605, 618, 632, 646, 661, 677, 694, 711, 729, 748, 768, 789, 810, 832, 855,
    ],
    startAge: 20,
  },
  output: {
    bachiAgeSexAccuracyIndex: 5.918584976125194,
    maleComponent: 3.358384217942696,
    femaleComponent: 2.560200758182498,
  },
} satisfies ToolExample<BachiAgeSexAccuracyInput, BachiAgeSexAccuracyOutput>;

export const bachiAgeSexAccuracyTool = createSimpleTool({
  id: "demography/bachi-age-sex-accuracy-index",
  title: "Bachi Age-Sex Accuracy Index Calculator",
  description:
    "Compute Bachi's age-sex accuracy index, the sum over both sexes of half the total absolute deviation of terminal-digit shares from ten percent across complete decades of single ages.",
  inputs: [
    {
      description:
        "Males at each single year of age starting with the starting age.",
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
      description:
        "Age of the first entry in both lists; the span must be complete decades.",
      id: "startAge",
      kind: "integer",
      label: "Start age",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Combined Bachi age-sex accuracy index; zero indicates no digit preference.",
      id: "bachiAgeSexAccuracyIndex",
      kind: "number",
      label: "Bachi index",
    },
    {
      description: "Male-only digit-preference component.",
      id: "maleComponent",
      kind: "number",
      label: "Male",
    },
    {
      description: "Female-only digit-preference component.",
      id: "femaleComponent",
      kind: "number",
      label: "Female",
    },
  ],
  calculate: (input) =>
    calculateBachiAgeSexAccuracy(input as unknown as BachiAgeSexAccuracyInput),
});

export const runBachiAgeSexAccuracy = bachiAgeSexAccuracyTool.execute;
export default bachiAgeSexAccuracyTool;
