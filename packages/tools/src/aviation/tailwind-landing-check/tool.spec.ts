import { describe, expect, it } from "vitest";
import {
  runTailwindLandingCheck,
  tailwindLandingCheckExample,
} from "./tool.js";

describe("tailwind landing check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTailwindLandingCheck(tailwindLandingCheckExample.input)).toEqual({
      ok: true,
      output: tailwindLandingCheckExample.output,
    });
  });

  it("passes when the tailwind equals the limit", () => {
    expect(
      runTailwindLandingCheck({ maxTailwindKt: 10, tailwindKt: 10 }),
    ).toEqual({ ok: true, output: { withinLimits: true } });
  });

  it("fails when the tailwind exceeds the limit", () => {
    expect(
      runTailwindLandingCheck({ maxTailwindKt: 15, tailwindKt: 16 }),
    ).toEqual({ ok: true, output: { withinLimits: false } });
  });

  it("passes for calm winds regardless of the limit", () => {
    expect(
      runTailwindLandingCheck({ maxTailwindKt: 0, tailwindKt: 0 }),
    ).toEqual({ ok: true, output: { withinLimits: true } });
  });

  it("returns a boolean output field", () => {
    const result = runTailwindLandingCheck({
      maxTailwindKt: 15,
      tailwindKt: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(typeof result.output.withinLimits).toBe("boolean");
  });

  it("rejects negative tailwinds through validation", () => {
    expect(
      runTailwindLandingCheck({ maxTailwindKt: 15, tailwindKt: -2 }).ok,
    ).toBe(false);
  });

  it("rejects negative limits through validation", () => {
    expect(
      runTailwindLandingCheck({ maxTailwindKt: -1, tailwindKt: 0 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { maxTailwindKt: Number.NaN, tailwindKt: 10 },
      { maxTailwindKt: 15, tailwindKt: Number.NEGATIVE_INFINITY },
    ])
      expect(runTailwindLandingCheck(bad).ok).toBe(false);
  });
});
