import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AgeingIndexOldYoungRatioInput = {
  readonly populationUnder15: number;
  readonly population65AndOver: number;
};

export type AgeingIndexOldYoungRatioOutput = {
  readonly ageingIndexPercent: number;
};

export const calculateAgeingIndexOldYoungRatio = (
  input: AgeingIndexOldYoungRatioInput,
): AgeingIndexOldYoungRatioOutput => {
  if (!(input.populationUnder15 > 0))
    return simpleError(
      "populationUnder15",
      "Population aged 0-14 must be greater than zero.",
      "invalid_population",
    );
  if (!(input.population65AndOver >= 0))
    return simpleError(
      "population65AndOver",
      "Population aged 65+ must be non-negative.",
      "invalid_population",
    );
  return {
    ageingIndexPercent:
      (100 * input.population65AndOver) / input.populationUnder15,
  };
};

export const ageingIndexOldYoungRatioExample = {
  input: { populationUnder15: 3000, population65AndOver: 2400 },
  output: { ageingIndexPercent: 80 },
} satisfies ToolExample<
  AgeingIndexOldYoungRatioInput,
  AgeingIndexOldYoungRatioOutput
>;

export const ageingIndexOldYoungRatioTool = createSimpleTool({
  id: "demography/ageing-index-old-young-ratio",
  title: "Ageing Index Calculator",
  description:
    "Compute the ageing index, the number of persons aged 65 and over per hundred children under age 15.",
  inputs: [
    {
      description: "Population aged 0-14 years.",
      id: "populationUnder15",
      kind: "number",
      label: "Pop 0-14",
      minimum: 0,
    },
    {
      description: "Population aged 65 years and over.",
      id: "population65AndOver",
      kind: "number",
      label: "Pop 65+",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Persons 65+ per 100 persons under 15.",
      id: "ageingIndexPercent",
      kind: "number",
      label: "Ageing index",
    },
  ],
  calculate: (input) =>
    calculateAgeingIndexOldYoungRatio(
      input as unknown as AgeingIndexOldYoungRatioInput,
    ),
});

export const runAgeingIndexOldYoungRatio = ageingIndexOldYoungRatioTool.execute;
export default ageingIndexOldYoungRatioTool;
