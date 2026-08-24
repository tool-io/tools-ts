import { describe, expect, it } from "vitest";
import {
  calculateWebcrawlFrequencyRecommender,
  runWebcrawlFrequencyRecommender,
  webcrawlFrequencyRecommenderExample,
} from "./tool.js";

describe("archival-studies/webcrawl-frequency-recommender", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWebcrawlFrequencyRecommender(
        webcrawlFrequencyRecommenderExample.input,
      ),
    ).toEqual({ ok: true, output: webcrawlFrequencyRecommenderExample.output });
  });

  it("escalates fast-changing sites to daily crawls", () => {
    const result = calculateWebcrawlFrequencyRecommender({
      changedPagesPerWeek: 100,
      totalPages: 1000,
    });
    expect(result.frequencyTier).toBe("daily");
    expect(result.recommendedCrawlsPerWeek).toBe(7);
  });

  it("rejects changed pages above the total", () => {
    expect(
      runWebcrawlFrequencyRecommender({
        changedPagesPerWeek: 50,
        totalPages: 10,
      }).ok,
    ).toBe(false);
  });
});
