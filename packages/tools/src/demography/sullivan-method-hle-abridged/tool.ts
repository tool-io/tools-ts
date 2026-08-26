import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SullivanMethodHleAbridgedInput = {
  readonly survivorsAtIntervalStarts: readonly number[];
  readonly personYearsLived: readonly number[];
  readonly disabilityPrevalence: readonly number[];
};

export type SullivanMethodHleAbridgedOutput = {
  readonly lifeExpectancyByInterval: number[];
  readonly healthyLifeExpectancyByInterval: number[];
};

export const calculateSullivanMethodHleAbridged = (
  input: SullivanMethodHleAbridgedInput,
): SullivanMethodHleAbridgedOutput => {
  const survivors = input.survivorsAtIntervalStarts;
  const personYears = input.personYearsLived;
  const prevalence = input.disabilityPrevalence;
  if (survivors.length < 1)
    return simpleError(
      "survivorsAtIntervalStarts",
      "Provide at least one life-table interval.",
      "invalid_list",
    );
  if (
    personYears.length !== survivors.length ||
    prevalence.length !== survivors.length
  )
    return simpleError(
      "disabilityPrevalence",
      "Survivors, person-years and prevalence lists must have the same length.",
      "invalid_list",
    );
  for (const value of survivors)
    if (!(value > 0))
      return simpleError(
        "survivorsAtIntervalStarts",
        "Life-table survivor counts must be greater than zero.",
        "invalid_list",
      );
  for (const value of personYears)
    if (!(value >= 0))
      return simpleError(
        "personYearsLived",
        "Person-years lived must be non-negative.",
        "invalid_list",
      );
  for (const value of prevalence)
    if (!(value >= 0 && value <= 1))
      return simpleError(
        "disabilityPrevalence",
        "Disability prevalence must lie between zero and one.",
        "invalid_list",
      );
  const lifeExpectancyByInterval: number[] = [];
  const healthyLifeExpectancyByInterval: number[] = [];
  for (let index = 0; index < survivors.length; index += 1) {
    let totalYears = 0;
    let healthyYears = 0;
    for (let inner = index; inner < survivors.length; inner += 1) {
      totalYears += personYears[inner] as number;
      healthyYears +=
        (personYears[inner] as number) * (1 - (prevalence[inner] as number));
    }
    const radix = survivors[index] as number;
    lifeExpectancyByInterval.push(totalYears / radix);
    healthyLifeExpectancyByInterval.push(healthyYears / radix);
  }
  return { lifeExpectancyByInterval, healthyLifeExpectancyByInterval };
};

export const sullivanMethodHleAbridgedExample = {
  input: {
    survivorsAtIntervalStarts: [100000, 94000, 88000],
    personYearsLived: [67000, 460000, 4330000],
    disabilityPrevalence: [0.02, 0.06, 0.14],
  },
  output: {
    lifeExpectancyByInterval: [48.57, 50.95744680851064, 49.20454545454545],
    healthyLifeExpectancyByInterval: [
      42.2186, 44.214893617021275, 42.31590909090909,
    ],
  },
} satisfies ToolExample<
  SullivanMethodHleAbridgedInput,
  SullivanMethodHleAbridgedOutput
>;

export const sullivanMethodHleAbridgedTool = createSimpleTool({
  id: "demography/sullivan-method-hle-abridged",
  title: "Sullivan Method HLE Calculator",
  description:
    "Apply the Sullivan method to an abridged life table, computing total and disability-free (healthy) life expectancy at the start of each interval where the final interval is open-ended.",
  inputs: [
    {
      description:
        "Persons surviving to the start of each interval; the first entry is the radix.",
      id: "survivorsAtIntervalStarts",
      kind: "numberList",
      label: "l(x)",
    },
    {
      description:
        "Person-years lived L(x) in each interval, aligned with l(x); treat the final interval as open-ended.",
      id: "personYearsLived",
      kind: "numberList",
      label: "L(x)",
    },
    {
      description:
        "Age-specific prevalence of disability or ill-health in each interval.",
      id: "disabilityPrevalence",
      kind: "numberList",
      label: "Prevalence",
    },
  ],
  outputs: [
    {
      description: "Total life expectancy at the start of each interval.",
      id: "lifeExpectancyByInterval",
      kind: "numberList",
      label: "e(x)",
    },
    {
      description: "Healthy life expectancy at the start of each interval.",
      id: "healthyLifeExpectancyByInterval",
      kind: "numberList",
      label: "HLE(x)",
    },
  ],
  calculate: (input) =>
    calculateSullivanMethodHleAbridged(
      input as unknown as SullivanMethodHleAbridgedInput,
    ),
});

export const runSullivanMethodHleAbridged =
  sullivanMethodHleAbridgedTool.execute;
export default sullivanMethodHleAbridgedTool;
