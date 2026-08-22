import { describe, expect, it } from "vitest";
import {
  requiredApproachSpeedGustExample,
  runRequiredApproachSpeedGust,
} from "./tool.js";

describe("required approach speed gust calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRequiredApproachSpeedGust(requiredApproachSpeedGustExample.input),
    ).toEqual({
      ok: true,
      output: requiredApproachSpeedGustExample.output,
    });
  });

  it("adds half of the gust spread", () => {
    expect(
      runRequiredApproachSpeedGust({
        referenceApproachSpeedKt: 95,
        gustSpreadKt: 18,
      }),
    ).toEqual({ ok: true, output: { targetApproachSpeedKt: 104 } });
  });

  it("keeps the reference speed in calm steady winds", () => {
    expect(
      runRequiredApproachSpeedGust({
        referenceApproachSpeedKt: 78,
        gustSpreadKt: 0,
      }),
    ).toEqual({ ok: true, output: { targetApproachSpeedKt: 78 } });
  });

  it("handles odd spreads with fractional knots", () => {
    const result = runRequiredApproachSpeedGust({
      referenceApproachSpeedKt: 100,
      gustSpreadKt: 15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.targetApproachSpeedKt).toBe(107.5);
  });

  it("scales the addition independently of the reference value", () => {
    const slow = runRequiredApproachSpeedGust({
      referenceApproachSpeedKt: 60,
      gustSpreadKt: 20,
    });
    const fast = runRequiredApproachSpeedGust({
      referenceApproachSpeedKt: 140,
      gustSpreadKt: 20,
    });
    if (!slow.ok || !fast.ok) throw new Error("expected success");
    expect(slow.output.targetApproachSpeedKt).toBe(70);
    expect(fast.output.targetApproachSpeedKt).toBe(150);
  });

  it("rejects non-positive reference speeds", () => {
    const result = runRequiredApproachSpeedGust({
      referenceApproachSpeedKt: 0,
      gustSpreadKt: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_reference_speed");
  });

  it("rejects negative gust spreads at the schema boundary", () => {
    expect(
      runRequiredApproachSpeedGust({
        referenceApproachSpeedKt: 130,
        gustSpreadKt: -5,
      }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runRequiredApproachSpeedGust({ gustSpreadKt: 10 })).toMatchObject({
      ok: false,
    });
    expect(
      runRequiredApproachSpeedGust({
        referenceApproachSpeedKt: "fast",
        gustSpreadKt: 10,
      }),
    ).toMatchObject({ ok: false });
  });
});
