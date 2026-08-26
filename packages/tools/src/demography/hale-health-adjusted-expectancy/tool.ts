import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HaleHealthAdjustedExpectancyInput = {
  readonly lifeExpectancyYears: number;
  readonly expectedYearsInReducedHealth: number;
};

export type HaleHealthAdjustedExpectancyOutput = {
  readonly haleYears: number;
};

export const calculateHaleHealthAdjustedExpectancy = (
  input: HaleHealthAdjustedExpectancyInput,
): HaleHealthAdjustedExpectancyOutput => {
  if (!(input.lifeExpectancyYears > 0))
    return simpleError(
      "lifeExpectancyYears",
      "Life expectancy must be greater than zero.",
      "invalid_expectancy",
    );
  if (!(input.expectedYearsInReducedHealth >= 0))
    return simpleError(
      "expectedYearsInReducedHealth",
      "Expected years in reduced health must be non-negative.",
      "invalid_expectancy",
    );
  if (input.expectedYearsInReducedHealth > input.lifeExpectancyYears)
    return simpleError(
      "expectedYearsInReducedHealth",
      "Years in reduced health cannot exceed total life expectancy.",
      "invalid_expectancy",
    );
  return {
    haleYears: input.lifeExpectancyYears - input.expectedYearsInReducedHealth,
  };
};

export const haleHealthAdjustedExpectancyExample = {
  input: { lifeExpectancyYears: 72.5, expectedYearsInReducedHealth: 9.4 },
  output: { haleYears: 63.1 },
} satisfies ToolExample<
  HaleHealthAdjustedExpectancyInput,
  HaleHealthAdjustedExpectancyOutput
>;

export const haleHealthAdjustedExpectancyTool = createSimpleTool({
  id: "demography/hale-health-adjusted-expectancy",
  title: "HALE Calculator",
  description:
    "Compute health-adjusted life expectancy as total life expectancy minus the expected number of years lived in reduced health, per the definitional identity used by summary measures of population health.",
  inputs: [
    {
      description: "Total life expectancy at the reference age in years.",
      id: "lifeExpectancyYears",
      kind: "number",
      label: "Life expectancy",
    },
    {
      description:
        "Expected years lived with disability or ill-health at that age.",
      id: "expectedYearsInReducedHealth",
      kind: "number",
      label: "Years unwell",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Health-adjusted life expectancy in years.",
      id: "haleYears",
      kind: "number",
      label: "HALE",
    },
  ],
  calculate: (input) =>
    calculateHaleHealthAdjustedExpectancy(
      input as unknown as HaleHealthAdjustedExpectancyInput,
    ),
});

export const runHaleHealthAdjustedExpectancy =
  haleHealthAdjustedExpectancyTool.execute;
export default haleHealthAdjustedExpectancyTool;
