import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AgeSpecificSexRatioCheckerInput = {
  readonly maleByAge: readonly number[];
  readonly femaleByAge: readonly number[];
  readonly minimumPlausible?: number;
  readonly maximumPlausible?: number;
};

export type AgeSpecificSexRatioCheckerOutput = {
  readonly sexRatios: number[];
  readonly outOfRangeCount: number;
};

export const calculateAgeSpecificSexRatioChecker = (
  input: AgeSpecificSexRatioCheckerInput,
): AgeSpecificSexRatioCheckerOutput => {
  const males = input.maleByAge;
  const females = input.femaleByAge;
  const minimumPlausible = input.minimumPlausible ?? 90;
  const maximumPlausible = input.maximumPlausible ?? 110;
  if (males.length !== females.length)
    return simpleError(
      "femaleByAge",
      "Male and female lists must have the same length.",
      "invalid_list",
    );
  if (males.length < 1)
    return simpleError(
      "maleByAge",
      "Provide at least one age group.",
      "invalid_list",
    );
  if (!(
    Number.isFinite(minimumPlausible) &&
    Number.isFinite(maximumPlausible) &&
    minimumPlausible >= 0 &&
    minimumPlausible < maximumPlausible
  ))
    return simpleError(
      "minimumPlausible",
      "The plausible band minimum must be below its maximum.",
      "invalid_band",
    );
  for (const count of males)
    if (!(Number.isFinite(count) && count >= 0))
      return simpleError(
        "maleByAge",
        "Male counts must be finite and non-negative.",
        "invalid_list",
      );
  const sexRatios: number[] = [];
  let outOfRangeCount = 0;
  for (let index = 0; index < males.length; index += 1) {
    const female = females[index] as number;
    if (!(Number.isFinite(female) && female > 0))
      return simpleError(
        "femaleByAge",
        "Female counts must be greater than zero to form a sex ratio.",
        "invalid_list",
      );
    const ratio = (100 * (males[index] as number)) / female;
    sexRatios.push(ratio);
    if (ratio < minimumPlausible || ratio > maximumPlausible)
      outOfRangeCount += 1;
  }
  return { sexRatios, outOfRangeCount };
};

export const ageSpecificSexRatioCheckerExample = {
  input: { maleByAge: [520, 500, 480], femaleByAge: [500, 510, 520] },
  output: {
    sexRatios: [104, 98.03921568627452, 92.3076923076923],
    outOfRangeCount: 0,
  },
} satisfies ToolExample<
  AgeSpecificSexRatioCheckerInput,
  AgeSpecificSexRatioCheckerOutput
>;

export const ageSpecificSexRatioCheckerTool = createSimpleTool({
  id: "demography/age-specific-sex-ratio-checker",
  title: "Age-Specific Sex Ratio Checker",
  description:
    "Compute the sex ratio (males per 100 females) for each age group and flag groups outside a plausibility band; the default band of 90-110 is a stated heuristic and fully adjustable.",
  inputs: [
    {
      description: "Male population of each age group.",
      id: "maleByAge",
      kind: "numberList",
      label: "Males",
    },
    {
      description:
        "Female population of each age group, aligned with the males.",
      id: "femaleByAge",
      kind: "numberList",
      label: "Females",
    },
    {
      default: 90,
      description:
        "Heuristic lower bound of plausible age-specific sex ratios.",
      id: "minimumPlausible",
      kind: "number",
      label: "Band minimum",
    },
    {
      default: 110,
      description:
        "Heuristic upper bound of plausible age-specific sex ratios.",
      id: "maximumPlausible",
      kind: "number",
      label: "Band maximum",
    },
  ],
  outputs: [
    {
      description: "Sex ratio (males per 100 females) of each age group.",
      id: "sexRatios",
      kind: "numberList",
      label: "Sex ratios",
    },
    {
      description:
        "Number of age groups whose ratio falls outside the plausibility band.",
      id: "outOfRangeCount",
      kind: "integer",
      label: "Out-of-range",
    },
  ],
  calculate: (input) =>
    calculateAgeSpecificSexRatioChecker(
      input as unknown as AgeSpecificSexRatioCheckerInput,
    ),
});

export const runAgeSpecificSexRatioChecker =
  ageSpecificSexRatioCheckerTool.execute;
export default ageSpecificSexRatioCheckerTool;
