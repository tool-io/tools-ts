import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cinemaProgramRuntimeExample as example,
  calculateCinemaProgramRuntime,
} from "./tool.js";

describe("Random Cinema Program Runtime Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCinemaProgramRuntime(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("preserves supplied clip records and lays trailers once before features with intervening breaks", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    expect(out.timeline.map((item) => item.kind)).toEqual([
      "trailer",
      "trailer",
      "feature",
      "intermission",
      "feature",
    ]);
    let cursor = 0;
    for (const item of out.timeline) {
      expect(item.startMinute).toBe(cursor);
      cursor += item.minutes;
      expect(item.endMinute).toBe(cursor);
    }
    expect(cursor).toBe(out.programMinutes);
    for (const clip of out.features)
      expect(clip).toEqual(
        example.input.features.find((source) => source.id === clip.id),
      );
    expect(new Set(out.features.map((clip) => clip.id)).size).toBe(2);
  });
  it("supports no trailers, one feature and explicit repeated clips", () => {
    expect(
      tool.execute({
        ...example.input,
        trailers: [],
        trailerCount: 0,
        featureCount: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        trailers: [],
        breaks: [],
        trailerMinutes: 0,
        meanTrailerMinutes: null,
        estimatedTrailerMinutes: 0,
        intermissionMinutes: 0,
      },
    });
    const result = tool.execute({
      ...example.input,
      features: [example.input.features[0]],
      featureCount: 3,
      withoutReplacement: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.features.map((clip) => clip.id)).toEqual([
        "F1",
        "F1",
        "F1",
      ]);
  });
  it("rejects shortages, missing trailer data, duplicate clip IDs and nonfinite totals", () => {
    for (const change of [
      { featureCount: 4 },
      { trailers: [] },
      { features: [example.input.features[0], example.input.features[0]] },
      {
        features: [
          { id: "large", title: "Synthetic", minutes: Number.MAX_VALUE },
        ],
        featureCount: 2,
        withoutReplacement: false,
      },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
