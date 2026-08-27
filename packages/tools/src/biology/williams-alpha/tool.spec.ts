import { describe, expect, it } from "vitest";
import { runWilliamsAlpha, williamsAlphaExample } from "./tool.js";

describe("Williams Alpha", () => {
  it("publishes an executable example", () =>
    expect(runWilliamsAlpha(williamsAlphaExample.input)).toEqual({
      ok: true,
      output: williamsAlphaExample.output,
    }));
  it("equals the regional count for one habitat", () =>
    expect(
      runWilliamsAlpha({ habitatsSampledInt: 1, regionalSpeciesInt: 48 }),
    ).toEqual({ ok: true, output: { williamsAlpha: 48 } }));
  it("yields fractional alpha when habitats do not divide evenly", () =>
    expect(
      runWilliamsAlpha({ habitatsSampledInt: 2, regionalSpeciesInt: 7 }),
    ).toEqual({ ok: true, output: { williamsAlpha: 3.5 } }));
  it("falls as more habitats are sampled", () => {
    const few = runWilliamsAlpha({
      habitatsSampledInt: 3,
      regionalSpeciesInt: 60,
    });
    const many = runWilliamsAlpha({
      habitatsSampledInt: 6,
      regionalSpeciesInt: 60,
    });
    if (!few.ok || !many.ok) throw new Error("expected success");
    expect(few.output.williamsAlpha as number).toBeGreaterThan(
      many.output.williamsAlpha as number,
    );
  });
  it("scales with the regional species pool", () =>
    expect(
      runWilliamsAlpha({ habitatsSampledInt: 4, regionalSpeciesInt: 44 }),
    ).toEqual({ ok: true, output: { williamsAlpha: 11 } }));
  it("rejects a regional pool without species", () => {
    const result = runWilliamsAlpha({
      habitatsSampledInt: 5,
      regionalSpeciesInt: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects zero habitats", () => {
    const result = runWilliamsAlpha({
      habitatsSampledInt: 0,
      regionalSpeciesInt: 60,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer habitat counts", () => {
    const result = runWilliamsAlpha({
      habitatsSampledInt: 2.5,
      regionalSpeciesInt: 60,
    });
    expect(result.ok).toBe(false);
  });
});
