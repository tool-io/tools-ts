import { describe, expect, it } from "vitest";
import { dbwToWattsExample, runDbwToWatts } from "./tool.js";

describe("dBW To Watts", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runDbwToWatts(dbwToWattsExample.input)).toEqual({
      ok: true,
      output: dbwToWattsExample.output,
    }));

  it("converts thirty dBW to one kilowatt", () =>
    expect(runDbwToWatts({ dbw: 30 })).toEqual({
      ok: true,
      output: { watts: 1000 },
    }));

  it("converts zero dBW to one watt", () =>
    expect(runDbwToWatts({ dbw: 0 })).toEqual({
      ok: true,
      output: { watts: 1 },
    }));

  it("converts negative levels below one watt", () =>
    expect(runDbwToWatts({ dbw: -10 })).toEqual({
      ok: true,
      output: { watts: 0.1 },
    }));

  it("gains two decades per twenty dBW", () => {
    const base = runDbwToWatts({ dbw: 3 });
    const boosted = runDbwToWatts({ dbw: 23 });
    expect(base.ok).toBe(true);
    expect(boosted.ok).toBe(true);
    if (!base.ok || !boosted.ok) return;
    expect(Number(boosted.output.watts)).toBeCloseTo(
      Number(base.output.watts) * 100,
    );
  });

  it("rises with the input level", () => {
    const lower = runDbwToWatts({ dbw: 3 });
    const higher = runDbwToWatts({ dbw: 4 });
    expect(lower.ok).toBe(true);
    expect(higher.ok).toBe(true);
    if (!lower.ok || !higher.ok) return;
    expect(Number(higher.output.watts)).toBeGreaterThan(
      Number(lower.output.watts),
    );
  });

  it("rejects non-finite levels and missing inputs", () => {
    expect(runDbwToWatts({ dbw: Number.POSITIVE_INFINITY })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "dbw" }] },
      ok: false,
    });
    expect(runDbwToWatts(undefined as never).ok).toBe(false);
  });
});
