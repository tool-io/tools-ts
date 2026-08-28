import { describe, expect, it } from "vitest";
import { runKbFromPkb, kbFromPkbExample } from "./tool.js";
describe("Kb From pKb", () => {
  it("publishes an executable example", () =>
    expect(runKbFromPkb(kbFromPkbExample.input)).toEqual({
      ok: true,
      output: kbFromPkbExample.output,
    }));
  it("converts pKb seven to one times ten to the minus seventh", () =>
    expect(runKbFromPkb({ pKb: 7 })).toEqual({
      ok: true,
      output: { kb: 1e-7 },
    }));
  it("maps pKb zero to unity", () =>
    expect(runKbFromPkb({ pKb: 0 })).toEqual({
      ok: true,
      output: { kb: 1 },
    }));
  it("accepts fractional pKb values", () => {
    const result = runKbFromPkb({ pKb: 4.75 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.kb).toBeCloseTo(1.7782794100389228e-5, 15);
  });
  it("handles negative pKb values above one", () =>
    expect(runKbFromPkb({ pKb: -2 })).toEqual({
      ok: true,
      output: { kb: 100 },
    }));
  it("rejects non-numeric input", () =>
    expect(runKbFromPkb({ pKb: "base" }).ok).toBe(false));
  it("rejects non-finite numbers", () =>
    expect(runKbFromPkb({ pKb: Number.POSITIVE_INFINITY }).ok).toBe(false));
});
