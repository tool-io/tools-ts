import { describe, expect, it } from "vitest";
import { runTideRuleOfTwelfths, tideRuleOfTwelfthsExample } from "./tool.js";

describe("Tide Rule of Twelfths Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runTideRuleOfTwelfths(tideRuleOfTwelfthsExample.input)).toEqual({
      ok: true,
      output: { heightChangeMeters: 0.5 },
    });
  });

  it("adds one twelfth during the first hour after slack", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 1, tidalRangeMeters: 3 }),
    ).toEqual({ ok: true, output: { heightChangeMeters: 0.25 } });
  });

  it("adds one twelfth during the final hour of the rise", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 6, tidalRangeMeters: 3 }),
    ).toEqual({ ok: true, output: { heightChangeMeters: 0.25 } });
  });

  it("peaks with three twelfths at hours three and four", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 3, tidalRangeMeters: 2.4 }),
    ).toEqual({ ok: true, output: { heightChangeMeters: 0.6 } });
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 4, tidalRangeMeters: 6 }),
    ).toEqual({ ok: true, output: { heightChangeMeters: 1.5 } });
  });

  it("mirrors two twelfths at hours two and five", () => {
    const second = runTideRuleOfTwelfths({
      hourIntoTide: 2,
      tidalRangeMeters: 2,
    });
    const fifth = runTideRuleOfTwelfths({
      hourIntoTide: 5,
      tidalRangeMeters: 2,
    });
    if (!second.ok || !fifth.ok) throw new Error("expected success");
    expect(second.output.heightChangeMeters).toBe(
      fifth.output.heightChangeMeters,
    );
    expect(second.output.heightChangeMeters).toBeCloseTo(
      0.3333333333333333,
      12,
    );
  });

  it("handles fractional ranges", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 3, tidalRangeMeters: 1.2 }),
    ).toEqual({ ok: true, output: { heightChangeMeters: 0.3 } });
  });

  it("rejects zero tidal range with a stable error", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 2, tidalRangeMeters: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "tidalRangeMeters" }] },
      ok: false,
    });
  });

  it("rejects out-of-range hours at the schema level", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 7, tidalRangeMeters: 3 }).ok,
    ).toBe(false);
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: -1, tidalRangeMeters: 3 }).ok,
    ).toBe(false);
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 0, tidalRangeMeters: 3 }).ok,
    ).toBe(false);
  });

  it("rejects fractional hours", () => {
    expect(
      runTideRuleOfTwelfths({ hourIntoTide: 2.5, tidalRangeMeters: 3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "hourIntoTide" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runTideRuleOfTwelfths({
        currentKt: 1,
        hourIntoTide: 2,
        tidalRangeMeters: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "currentKt" }] },
      ok: false,
    });
    expect(runTideRuleOfTwelfths(null).ok).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(runTideRuleOfTwelfths({ tidalRangeMeters: 3 }).ok).toBe(false);
  });
});
