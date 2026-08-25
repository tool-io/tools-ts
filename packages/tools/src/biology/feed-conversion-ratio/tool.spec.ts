import { describe, expect, it } from "vitest";
import { feedConversionRatioExample, runFeedConversionRatio } from "./tool.js";

describe("FCR Calculator", () => {
  it("publishes an executable example", () =>
    expect(runFeedConversionRatio(feedConversionRatioExample.input)).toEqual({
      ok: true,
      output: feedConversionRatioExample.output,
    }));
  it("returns a low ratio for efficient conversion", () => {
    const result = runFeedConversionRatio({
      feedConsumedKg: 25,
      weightGainKg: 50,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.feedConversionRatio).toBe(0.5);
  });
  it("allows zero feed consumption", () =>
    expect(
      runFeedConversionRatio({ feedConsumedKg: 0, weightGainKg: 10 }),
    ).toEqual({ ok: true, output: { feedConversionRatio: 0 } }));
  it("falls as weight gain improves", () => {
    const early = runFeedConversionRatio({
      feedConsumedKg: 200,
      weightGainKg: 80,
    });
    if (early.ok) expect(early.output.feedConversionRatio).toBe(2.5);
    else expect.fail("the calculation should succeed");
  });
  it("supports fractional ratios", () => {
    const result = runFeedConversionRatio({
      feedConsumedKg: 10,
      weightGainKg: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.feedConversionRatio).toBe(2.5);
  });
  it("rejects zero weight gain", () => {
    const result = runFeedConversionRatio({
      feedConsumedKg: 200,
      weightGainKg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_gain");
  });
  it("rejects negative weight gain with the same guard", () => {
    const result = runFeedConversionRatio({
      feedConsumedKg: 200,
      weightGainKg: -5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_gain");
  });
  it("rejects negative feed consumption", () =>
    expect(
      runFeedConversionRatio({ feedConsumedKg: -1, weightGainKg: 50 }).ok,
    ).toBe(false));
});
