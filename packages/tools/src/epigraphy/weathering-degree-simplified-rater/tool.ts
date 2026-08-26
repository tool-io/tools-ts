import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeatheringDegreeSimplifiedRaterInput = {
  readonly degree: number;
};

export type WeatheringDegreeSimplifiedRaterOutput = {
  readonly label: string;
  readonly severityFraction: number;
};

const DEGREE_LABELS = [
  "none",
  "slight",
  "moderate",
  "strong",
  "very strong",
  "extreme",
] as const;

export const calculateWeatheringDegreeSimplifiedRater = (
  input: WeatheringDegreeSimplifiedRaterInput,
): WeatheringDegreeSimplifiedRaterOutput => {
  if (!(
    Number.isInteger(input.degree) &&
    input.degree >= 0 &&
    input.degree <= 5
  ))
    return simpleError(
      "degree",
      "Degree must be an integer from 0 to 5.",
      "invalid_degree",
    );
  return {
    label: DEGREE_LABELS[input.degree],
    severityFraction: input.degree / 5,
  };
};

export const weatheringDegreeSimplifiedRaterExample = {
  input: { degree: 3 },
  output: { label: "strong", severityFraction: 0.6 },
} satisfies ToolExample<
  WeatheringDegreeSimplifiedRaterInput,
  WeatheringDegreeSimplifiedRaterOutput
>;

export const weatheringDegreeSimplifiedRaterTool = createSimpleTool({
  id: "epigraphy/weathering-degree-simplified-rater",
  title: "Weathering Degree Scale 0-5 Fitzner Heindrichs Simplified Rater",
  description:
    "Rate stone weathering on the simplified six-step degree scale, mapping an integer degree from 0 (none) to 5 (extreme) to a verbal label and severity fraction.",
  inputs: [
    {
      description: "Assigned weathering degree from 0 to 5.",
      id: "degree",
      kind: "integer",
      label: "Degree",
      maximum: 5,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Verbal label for the assigned degree.",
      id: "label",
      kind: "string",
      label: "Label",
    },
    {
      description: "Degree expressed as a fraction of the maximum severity.",
      id: "severityFraction",
      kind: "number",
      label: "Severity",
    },
  ],
  calculate: (input) =>
    calculateWeatheringDegreeSimplifiedRater(
      input as unknown as WeatheringDegreeSimplifiedRaterInput,
    ),
});

export const runWeatheringDegreeSimplifiedRater =
  weatheringDegreeSimplifiedRaterTool.execute;
export default weatheringDegreeSimplifiedRaterTool;
