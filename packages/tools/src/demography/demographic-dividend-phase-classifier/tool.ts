import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DemographicDividendPhaseClassifierInput = {
  readonly percentYoung: number;
  readonly percentWorking: number;
  readonly percentOld: number;
};

export type DemographicDividendPhaseClassifierOutput = {
  readonly childDependencyRatio: number;
  readonly oldAgeDependencyRatio: number;
  readonly totalDependencyRatio: number;
  readonly phase:
    "pre-dividend" | "early-dividend" | "late-dividend" | "post-dividend";
};

export const calculateDemographicDividendPhaseClassifier = (
  input: DemographicDividendPhaseClassifierInput,
): DemographicDividendPhaseClassifierOutput => {
  if (!(input.percentYoung >= 0))
    return simpleError(
      "percentYoung",
      "The young share must be non-negative.",
      "invalid_shares",
    );
  if (!(input.percentWorking > 0))
    return simpleError(
      "percentWorking",
      "The working-age share must be greater than zero.",
      "invalid_shares",
    );
  if (!(input.percentOld >= 0))
    return simpleError(
      "percentOld",
      "The old share must be non-negative.",
      "invalid_shares",
    );
  if (
    Math.abs(
      input.percentYoung + input.percentWorking + input.percentOld - 100,
    ) > 0.5
  )
    return simpleError(
      "percentYoung",
      "The three age shares must sum to about one hundred percent.",
      "invalid_shares",
    );
  const childDependencyRatio =
    (input.percentYoung / input.percentWorking) * 100;
  const oldAgeDependencyRatio = (input.percentOld / input.percentWorking) * 100;
  const totalDependencyRatio = childDependencyRatio + oldAgeDependencyRatio;
  const phase =
    childDependencyRatio > oldAgeDependencyRatio
      ? totalDependencyRatio > 70
        ? "pre-dividend"
        : "early-dividend"
      : totalDependencyRatio > 70
        ? "post-dividend"
        : "late-dividend";
  return {
    childDependencyRatio,
    oldAgeDependencyRatio,
    totalDependencyRatio,
    phase,
  };
};

export const demographicDividendPhaseClassifierExample = {
  input: { percentYoung: 30, percentWorking: 60, percentOld: 10 },
  output: {
    childDependencyRatio: 50,
    oldAgeDependencyRatio: 16.666666666666664,
    totalDependencyRatio: 66.66666666666666,
    phase: "early-dividend",
  },
} satisfies ToolExample<
  DemographicDividendPhaseClassifierInput,
  DemographicDividendPhaseClassifierOutput
>;

export const demographicDividendPhaseClassifierTool = createSimpleTool({
  id: "demography/demographic-dividend-phase-classifier",
  title: "Demographic Dividend Phase Classifier",
  description:
    "Classify the demographic dividend phase from age shares using the stated rule: child dependency above old-age dependency with a total dependency ratio over 70 is pre-dividend, otherwise early-dividend; once old-age dependency meets or exceeds child dependency a ratio of 70 or less is late-dividend and above 70 is post-dividend.",
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
      description: "Population aged 0-14 per 100 people aged 15-64.",
      id: "childDependencyRatio",
      kind: "number",
      label: "Child dependency",
    },
    {
      description: "Population aged 65+ per 100 people aged 15-64.",
      id: "oldAgeDependencyRatio",
      kind: "number",
      label: "Old-age dependency",
    },
    {
      description: "Sum of child and old-age dependency ratios.",
      id: "totalDependencyRatio",
      kind: "number",
      label: "Total dependency",
    },
    {
      description: "Dividend phase under the documented dependency-ratio rule.",
      enum: [
        "pre-dividend",
        "early-dividend",
        "late-dividend",
        "post-dividend",
      ],
      id: "phase",
      kind: "string",
      label: "Phase",
    },
  ],
  calculate: (input) =>
    calculateDemographicDividendPhaseClassifier(
      input as unknown as DemographicDividendPhaseClassifierInput,
    ),
});

export const runDemographicDividendPhaseClassifier =
  demographicDividendPhaseClassifierTool.execute;
export default demographicDividendPhaseClassifierTool;
