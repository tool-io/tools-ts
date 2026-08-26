import { describe, expect, it } from "vitest";
import { runWavePeriodFetch, wavePeriodFetchExample } from "./tool.js";

describe("wave period estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWavePeriodFetch(wavePeriodFetchExample.input)).toEqual({
      ok: true,
      output: wavePeriodFetchExample.output,
    });
  });

  it("uses both fetch and wind speed", () => {
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: 4, windSpeedKt: 20 }),
    ).toEqual({
      ok: true,
      output: { periodSeconds: 2.9656988665499475 },
    });
  });

  it("grows with fetch while approaching a fully developed limit", () => {
    const short = runWavePeriodFetch({
      fetchNauticalMiles: 1,
      windSpeedKt: 20,
    });
    const long = runWavePeriodFetch({
      fetchNauticalMiles: 400,
      windSpeedKt: 20,
    });
    if (!short.ok || !long.ok) throw new Error("expected success");
    expect(long.output.periodSeconds).toBeGreaterThan(
      short.output.periodSeconds as number,
    );
    expect(long.output.periodSeconds).toBeLessThan(8);
  });

  it("rejects zero fetches through calculation and negative fetches through validation", () => {
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: 0, windSpeedKt: 20 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "fetchNauticalMiles" }],
      },
      ok: false,
    });
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: -50, windSpeedKt: 20 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "fetchNauticalMiles" }],
      },
      ok: false,
    });
  });

  it("accepts small positive fetches at the practical boundary", () => {
    const result = runWavePeriodFetch({
      fetchNauticalMiles: 0.25,
      windSpeedKt: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.periodSeconds).toBeCloseTo(1.5389696892721392, 12);
  });

  it("rejects a non-positive wind speed", () => {
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: 10, windSpeedKt: 0 }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed inputs", () => {
    expect(runWavePeriodFetch({}).ok).toBe(false);
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: Number.NaN, windSpeedKt: 20 })
        .ok,
    ).toBe(false);
    expect(
      runWavePeriodFetch({ fetchNauticalMiles: "long", windSpeedKt: 20 }).ok,
    ).toBe(false);
  });
});
