import { describe, expect, it } from "vitest";
import { dbmToWattsExample, runDbmToWatts } from "./tool.js";

describe("dBm To Watts", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runDbmToWatts(dbmToWattsExample.input)).toEqual({
      ok: true,
      output: dbmToWattsExample.output,
    }));

  it("converts 27 dBm to about half a watt", () =>
    expect(runDbmToWatts({ dbm: 27 })).toEqual({
      ok: true,
      output: { watts: 0.5011872336272722 },
    }));

  it("converts zero dBm to one milliwatt", () =>
    expect(runDbmToWatts({ dbm: 0 })).toEqual({
      ok: true,
      output: { watts: 0.001 },
    }));

  it("converts negative levels down to microwatts", () =>
    expect(runDbmToWatts({ dbm: -30 })).toEqual({
      ok: true,
      output: { watts: 0.000001 },
    }));

  it("rises with the input level", () => {
    const lower = runDbmToWatts({ dbm: 30 });
    const higher = runDbmToWatts({ dbm: 31 });
    expect(lower.ok).toBe(true);
    expect(higher.ok).toBe(true);
    if (!lower.ok || !higher.ok) return;
    expect(Number(higher.output.watts)).toBeGreaterThan(
      Number(lower.output.watts),
    );
  });

  it("steps one decade per ten dBm", () => {
    const base = runDbmToWatts({ dbm: 10 });
    const decade = runDbmToWatts({ dbm: 20 });
    expect(base.ok).toBe(true);
    expect(decade.ok).toBe(true);
    if (!base.ok || !decade.ok) return;
    expect(Number(decade.output.watts)).toBeCloseTo(
      Number(base.output.watts) * 10,
    );
  });

  it("rejects non-finite levels", () =>
    expect(runDbmToWatts({ dbm: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "dbm" }] },
      ok: false,
    }));
});
