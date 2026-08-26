import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PopulationPyramidShapeClassifierInput = {
  readonly percentYoung: number;
  readonly percentWorking: number;
  readonly percentOld: number;
};

export type PopulationPyramidShapeClassifierOutput = {
  readonly shapeClass: "expansive" | "stationary" | "constrictive";
  readonly dependencyRatio: number;
};

export const calculatePopulationPyramidShapeClassifier = (
  input: PopulationPyramidShapeClassifierInput,
): PopulationPyramidShapeClassifierOutput => {
  for (const [field, value] of [
    ["percentYoung", input.percentYoung],
    ["percentWorking", input.percentWorking],
    ["percentOld", input.percentOld],
  ] as const)
    if (!(Number.isFinite(value) && value >= 0 && value <= 100))
      simpleError(
        field,
        "Each age share must be finite and lie between zero and one hundred percent.",
        "invalid_shares",
      );
  const total = input.percentYoung + input.percentWorking + input.percentOld;
  if (!(Math.abs(total - 100) <= 0.5))
    simpleError(
      "percentYoung",
      "The three age shares must sum to about one hundred percent.",
      "invalid_shares",
    );
  if (!(input.percentWorking > 0))
    simpleError(
      "percentWorking",
      "The working-age share must be greater than zero.",
      "invalid_shares",
    );
  return {
    shapeClass:
      Math.abs(input.percentYoung - input.percentOld) <= 0.5
        ? "stationary"
        : input.percentYoung > input.percentOld
          ? "expansive"
          : "constrictive",
    dependencyRatio:
      ((input.percentYoung + input.percentOld) / input.percentWorking) * 100,
  };
};

export const populationPyramidShapeClassifierExample = {
  input: { percentYoung: 30, percentWorking: 60, percentOld: 10 },
  output: { shapeClass: "expansive", dependencyRatio: 66.66666666666666 },
} satisfies ToolExample<
  PopulationPyramidShapeClassifierInput,
  PopulationPyramidShapeClassifierOutput
>;

export const populationPyramidShapeClassifierTool = createSimpleTool({
  id: "demography/population-pyramid-shape-classifier",
  title: "Population Pyramid Shape Classifier",
  description:
    "Classify a pyramid as expansive when the young share exceeds the old share by more than half a point, constrictive when the reverse holds, stationary when they are equal within half a point, and report the age-dependency ratio.",
  inputs: [
    {
      description: "Percent of the population aged 0-14.",
      id: "percentYoung",
      kind: "number",
      label: "Young %",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Percent of the population aged 15-64.",
      id: "percentWorking",
      kind: "number",
      label: "Working %",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Percent of the population aged 65 and over.",
      id: "percentOld",
      kind: "number",
      label: "Old %",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Classic pyramid-shape classification.",
      enum: ["expansive", "stationary", "constrictive"],
      id: "shapeClass",
      kind: "string",
      label: "Shape",
    },
    {
      description:
        "Dependency ratio (young plus old) per 100 working-age persons.",
      id: "dependencyRatio",
      kind: "number",
      label: "Dependency",
    },
  ],
  calculate: (input) =>
    calculatePopulationPyramidShapeClassifier(
      input as unknown as PopulationPyramidShapeClassifierInput,
    ),
});

export const runPopulationPyramidShapeClassifier =
  populationPyramidShapeClassifierTool.execute;
export default populationPyramidShapeClassifierTool;
