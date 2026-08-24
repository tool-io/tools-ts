import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WebcrawlFrequencyRecommenderInput = {
  readonly changedPagesPerWeek: number;
  readonly totalPages: number;
};

export type WebcrawlFrequencyRecommenderOutput = {
  readonly changeFraction: number;
  readonly frequencyTier: "monthly" | "weekly" | "twiceWeekly" | "daily";
  readonly recommendedCrawlsPerWeek: number;
};

export const calculateWebcrawlFrequencyRecommender = (
  input: WebcrawlFrequencyRecommenderInput,
): WebcrawlFrequencyRecommenderOutput => {
  if (!(Number.isInteger(input.totalPages) && input.totalPages > 0))
    simpleError("totalPages", "Total pages must be a positive integer.");
  if (!(
    Number.isInteger(input.changedPagesPerWeek) &&
    input.changedPagesPerWeek >= 0
  ))
    simpleError(
      "changedPagesPerWeek",
      "Changed pages must be a non-negative integer.",
    );
  if (input.changedPagesPerWeek > input.totalPages)
    return simpleError(
      "changedPagesPerWeek",
      "Changed pages cannot exceed the total pages in the collection.",
      "invalid_counts",
    );
  const changeFraction = input.changedPagesPerWeek / input.totalPages;
  const frequencyTier =
    changeFraction < 0.005
      ? "monthly"
      : changeFraction < 0.02
        ? "weekly"
        : changeFraction < 0.08
          ? "twiceWeekly"
          : "daily";
  const recommendedCrawlsPerWeek =
    frequencyTier === "monthly"
      ? 0.25
      : frequencyTier === "weekly"
        ? 1
        : frequencyTier === "twiceWeekly"
          ? 2
          : 7;
  return { changeFraction, frequencyTier, recommendedCrawlsPerWeek };
};

export const webcrawlFrequencyRecommenderExample = {
  input: { changedPagesPerWeek: 4, totalPages: 400 },
  output: {
    changeFraction: 0.01,
    frequencyTier: "weekly",
    recommendedCrawlsPerWeek: 1,
  },
} satisfies ToolExample<
  WebcrawlFrequencyRecommenderInput,
  WebcrawlFrequencyRecommenderOutput
>;

export const webcrawlFrequencyRecommenderTool = createSimpleTool({
  id: "archival-studies/webcrawl-frequency-recommender",
  title: "Web Crawl Frequency by Site Change Rate Recommender",
  description:
    "Apply a local planning policy to recommend a web-archiving crawl cadence from the weekly page-change fraction: monthly below 0.5%, weekly below 2%, twice weekly below 8%, and daily otherwise. Adjust the thresholds to match collection risk and crawl budget before operational use.",
  inputs: [
    {
      description: "Pages that change in a typical week.",
      id: "changedPagesPerWeek",
      kind: "integer",
      label: "Changed pages",
      minimum: 0,
    },
    {
      description: "Total pages tracked in the crawl target.",
      id: "totalPages",
      kind: "integer",
      label: "Total pages",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Share of the collection changing per week.",
      id: "changeFraction",
      kind: "number",
      label: "Change fraction",
    },
    {
      description: "Recommended crawl cadence tier.",
      enum: ["monthly", "weekly", "twiceWeekly", "daily"],
      id: "frequencyTier",
      kind: "string",
      label: "Cadence tier",
    },
    {
      description: "Recommended crawls per week for the tier.",
      id: "recommendedCrawlsPerWeek",
      kind: "number",
      label: "Crawls per week",
    },
  ],
  calculate: (input) =>
    calculateWebcrawlFrequencyRecommender({
      changedPagesPerWeek: input.changedPagesPerWeek as number,
      totalPages: input.totalPages as number,
    }),
});

export const runWebcrawlFrequencyRecommender =
  webcrawlFrequencyRecommenderTool.execute;
export default webcrawlFrequencyRecommenderTool;
