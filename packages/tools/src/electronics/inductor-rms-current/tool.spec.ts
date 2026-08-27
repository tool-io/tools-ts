import { describe, expect, it } from "vitest";
import { inductorRmsCurrentExample, runInductorRmsCurrent } from "./tool.js";

describe("RMS Inductor Current", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runInductorRmsCurrent(inductorRmsCurrentExample.input)).toEqual({
      ok: true,
      output: inductorRmsCurrentExample.output,
    }));

  it("equals sqrt(1 + 1/12) for unit load and ripple currents", () =>
    expect(
      runInductorRmsCurrent({ loadCurrentAmps: 1, rippleCurrentAmps: 1 }),
    ).toEqual({
      ok: true,
      output: { rmsCurrentA: 1.0408329997330663 },
    }));

  it("approaches the load current as the ripple shrinks", () => {
    const result = runInductorRmsCurrent({
      loadCurrentAmps: 2,
      rippleCurrentAmps: 0.01,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rmsCurrentA).toBeCloseTo(2.0000020833322485, 12);
  });

  it("never falls below the load current", () => {
    const result = runInductorRmsCurrent({
      loadCurrentAmps: 1.5,
      rippleCurrentAmps: 2.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rmsCurrentA).toBeGreaterThanOrEqual(1.5);
  });

  it("rejects a non-positive load current", () =>
    expect(
      runInductorRmsCurrent({ loadCurrentAmps: -2, rippleCurrentAmps: 0.6 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "loadCurrentAmps" }],
      },
      ok: false,
    }));

  it("rejects a non-positive ripple current", () =>
    expect(
      runInductorRmsCurrent({ loadCurrentAmps: 2, rippleCurrentAmps: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "rippleCurrentAmps" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runInductorRmsCurrent(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
