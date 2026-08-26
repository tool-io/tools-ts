import { describe, expect, it } from "vitest";
import { reefingWindSpeedExample, runReefingWindSpeed } from "./tool.js";

describe("reefing wind speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReefingWindSpeed(reefingWindSpeedExample.input)).toEqual({
      ok: true,
      output: reefingWindSpeedExample.output,
    });
  });

  it("defaults the reef factor to thirty percent", () => {
    expect(runReefingWindSpeed({ designWindKt: 20 })).toEqual({
      ok: true,
      output: { reefWindKt: 6 },
    });
  });

  it("honors an explicit reef factor of ten percent at the lower boundary", () => {
    expect(
      runReefingWindSpeed({ designWindKt: 20, reefFactorPercent: 10 }),
    ).toEqual({ ok: true, output: { reefWindKt: 2 } });
  });

  it("honors an explicit reef factor of one hundred percent at the upper boundary", () => {
    expect(
      runReefingWindSpeed({ designWindKt: 20, reefFactorPercent: 100 }),
    ).toEqual({ ok: true, output: { reefWindKt: 20 } });
  });

  it("scales linearly with the design wind speed", () => {
    const single = runReefingWindSpeed({
      designWindKt: 15,
      reefFactorPercent: 40,
    });
    const doubled = runReefingWindSpeed({
      designWindKt: 30,
      reefFactorPercent: 40,
    });
    if (!single.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.reefWindKt).toBe(
      2 * (single.output.reefWindKt as number),
    );
  });

  it("rejects reef factors outside the inclusive range through validation", () => {
    for (const reefFactorPercent of [5, 9.9, 150])
      expect(
        runReefingWindSpeed({ designWindKt: 20, reefFactorPercent }).ok,
      ).toBe(false);
  });

  it("rejects zero and negative design wind speeds with a stable code", () => {
    for (const designWindKt of [0, -12])
      expect(runReefingWindSpeed({ designWindKt })).toMatchObject({
        error: { issues: [{ code: "invalid_input", field: "designWindKt" }] },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runReefingWindSpeed({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "designWindKt" }] },
      ok: false,
    });
  });

  it("rejects non-finite design wind speeds", () => {
    expect(
      runReefingWindSpeed({ designWindKt: Number.NaN, reefFactorPercent: 30 })
        .ok,
    ).toBe(false);
    expect(
      runReefingWindSpeed({ designWindKt: 20, reefFactorPercent: Number.NaN })
        .ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(runReefingWindSpeed({ designWindKt: 25, gustKt: 35 })).toMatchObject(
      {
        error: { issues: [{ code: "unknown_field", field: "gustKt" }] },
        ok: false,
      },
    );
  });
});
