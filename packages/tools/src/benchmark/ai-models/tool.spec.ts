import { describe, expect, it } from "vitest";

import type { AiModelBenchmarkDataset } from "./tool.js";
import { example, rankAiModels } from "./tool.js";

const data: AiModelBenchmarkDataset = {
  schemaVersion: 1,
  benchmarks: [
    {
      dataset: null,
      harness: null,
      id: "example-v1",
      metric: "accuracy",
      name: "Example",
      preference: "higher",
      variant: null,
      version: "1",
    },
    {
      dataset: null,
      harness: null,
      id: "example-v2",
      metric: "accuracy",
      name: "Example",
      preference: "higher",
      variant: null,
      version: "2",
    },
  ],
  models: [
    {
      description: "First model",
      family: "alpha",
      id: "lab/alpha",
      lastUpdated: "2026-08-01",
      limits: { context: 100_000, output: 10_000 },
      name: "Alpha",
      offers: [
        {
          inputUsdPerMillion: 2,
          outputUsdPerMillion: 8,
          providerId: "provider",
          providerModelId: "alpha",
          providerName: "Provider",
        },
      ],
      openWeights: false,
      releaseDate: "2026-08-01",
      scores: [
        {
          benchmarkId: "example-v1",
          citations: [
            { name: "Alpha report", url: "https://example.com/alpha" },
          ],
          date: "2026-08-01",
          datasets: [],
          evaluationVariant: null,
          harness: null,
          id: "lab/alpha#one",
          modelVariant: "medium",
          score: 80,
          tasks: [],
          verified: true,
        },
      ],
    },
    {
      description: "Second model",
      family: "beta",
      id: "lab/beta",
      lastUpdated: "2026-08-02",
      limits: { context: 200_000, output: 20_000 },
      name: "Beta",
      offers: [
        {
          inputUsdPerMillion: 1,
          outputUsdPerMillion: 4,
          providerId: "provider",
          providerModelId: "beta",
          providerName: "Provider",
        },
      ],
      openWeights: true,
      releaseDate: "2026-08-02",
      scores: [
        {
          benchmarkId: "example-v1",
          citations: [{ name: "Beta report", url: "https://example.com/beta" }],
          date: "2026-08-02",
          datasets: [],
          evaluationVariant: null,
          harness: null,
          id: "lab/beta#one",
          modelVariant: "high",
          score: 90,
          tasks: [],
          verified: true,
        },
        {
          benchmarkId: "example-v2",
          citations: [
            { name: "Beta v2 report", url: "https://example.com/beta-v2" },
          ],
          date: "2026-08-02",
          datasets: [],
          evaluationVariant: null,
          harness: null,
          id: "lab/beta#two",
          modelVariant: null,
          score: 70,
          tasks: [],
          verified: null,
        },
      ],
    },
  ],
};

describe("AI model benchmark", () => {
  it("executes its canonical example", () => {
    expect(rankAiModels(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("ranks only scores from the selected benchmark definition", () => {
    const result = rankAiModels({
      benchmarkId: "example-v1",
      data,
      sortBy: "benchmark-score",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.rows.map(({ modelId }) => modelId)).toEqual([
      "lab/beta",
      "lab/alpha",
    ]);
    expect(result.output.benchmark?.version).toBe("1");
  });

  it("keeps models without the selected score last", () => {
    const result = rankAiModels({
      benchmarkId: "example-v2",
      data,
      sortBy: "benchmark-score",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.rows.map(({ modelId }) => modelId)).toEqual([
      "lab/beta",
      "lab/alpha",
    ]);
  });

  it("filters open-weight models and supports cost sorting", () => {
    const result = rankAiModels({
      data,
      direction: "ascending",
      openWeightsOnly: true,
      sortBy: "input-cost",
    });

    expect(result).toMatchObject({
      ok: true,
      output: { rows: [{ modelId: "lab/beta", lowestInputUsdPerMillion: 1 }] },
    });
  });

  it("keeps separately sourced results as separate model rows", () => {
    const secondObservation: AiModelBenchmarkDataset = {
      ...data,
      models: data.models.map((model) =>
        model.id === "lab/beta"
          ? {
              ...model,
              scores: [
                ...model.scores,
                {
                  benchmarkId: "example-v1",
                  citations: [
                    {
                      name: "Independent report",
                      url: "https://example.com/independent",
                    },
                  ],
                  date: "2026-08-03",
                  datasets: ["example/benchmark"],
                  evaluationVariant: null,
                  harness: "Independent harness",
                  id: "lab/beta#three",
                  modelVariant: "high",
                  score: 88,
                  tasks: ["accuracy"],
                  verified: false,
                },
              ],
            }
          : model,
      ),
    };
    const result = rankAiModels({
      benchmarkId: "example-v1",
      data: secondObservation,
      sortBy: "benchmark-score",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.output.rows.filter(({ modelId }) => modelId === "lab/beta"),
    ).toHaveLength(2);
  });

  it("rejects benchmark IDs that are not in the supplied dataset", () => {
    expect(rankAiModels({ benchmarkId: "missing", data })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });
});
