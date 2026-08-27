import { describe, expect, it } from "vitest";
import { inductorPeakCurrentExample, runInductorPeakCurrent } from "./tool.js";

describe("Peak Inductor Current", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runInductorPeakCurrent(inductorPeakCurrentExample.input)).toEqual({
      ok: true,
      output: inductorPeakCurrentExample.output,
    }));

  it("adds half of the ripple to the load current", () =>
    expect(
      runInductorPeakCurrent({ loadCurrentA: 1, rippleCurrentA: 0.5 }),
    ).toEqual({ ok: true, output: { peakCurrentA: 1.25 } }));

  it("exceeds the load current for any positive ripple", () => {
    const result = runInductorPeakCurrent({
      loadCurrentA: 3,
      rippleCurrentA: 1.2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.peakCurrentA).toBe(3.6);
    expect(result.output.peakCurrentA).toBeGreaterThan(3);
  });

  it("grows with the load current at fixed ripple", () => {
    const low = runInductorPeakCurrent({
      loadCurrentA: 0.5,
      rippleCurrentA: 0.4,
    });
    const high = runInductorPeakCurrent({
      loadCurrentA: 5,
      rippleCurrentA: 0.4,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.peakCurrentA).toBeGreaterThan(
      Number(low.output.peakCurrentA),
    );
  });

  it("rejects a non-positive load current", () =>
    expect(
      runInductorPeakCurrent({ loadCurrentA: 0, rippleCurrentA: 0.6 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "loadCurrentA" }] },
      ok: false,
    }));

  it("rejects a negative ripple current", () =>
    expect(
      runInductorPeakCurrent({ loadCurrentA: 2, rippleCurrentA: -0.6 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "rippleCurrentA" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runInductorPeakCurrent(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
