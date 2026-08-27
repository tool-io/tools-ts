import { describe, expect, it } from "vitest";
import {
  coaxialCapacitancePerMeterExample,
  runCoaxialCapacitancePerMeter,
} from "./tool.js";

describe("Coax C Per Meter", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runCoaxialCapacitancePerMeter(coaxialCapacitancePerMeterExample.input),
    ).toEqual({ ok: true, output: coaxialCapacitancePerMeterExample.output }));

  it("scales linearly with the dielectric constant at fixed geometry", () =>
    expect(
      runCoaxialCapacitancePerMeter({
        dielectricConstant: 2,
        diameterInner: 1,
        diameterOuter: 4,
      }),
    ).toEqual({
      ok: true,
      output: { capacitancePfPerMeter: 34.76895048542402 },
    }));

  it("falls as the diameter ratio widens for the same dielectric", () => {
    const tight = runCoaxialCapacitancePerMeter({
      dielectricConstant: 2.1,
      diameterInner: 1,
      diameterOuter: 2,
    });
    const wide = runCoaxialCapacitancePerMeter({
      dielectricConstant: 2.1,
      diameterInner: 1,
      diameterOuter: 10,
    });
    if (!tight.ok || !wide.ok) throw new Error("expected success");
    expect(wide.output.capacitancePfPerMeter).toBeLessThan(
      Number(tight.output.capacitancePfPerMeter),
    );
  });

  it("rejects a dielectric constant of one or less", () =>
    expect(
      runCoaxialCapacitancePerMeter({
        dielectricConstant: 1,
        diameterInner: 1,
        diameterOuter: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dimensions", field: "dielectricConstant" }],
      },
      ok: false,
    }));

  it("rejects reversed diameters", () =>
    expect(
      runCoaxialCapacitancePerMeter({
        dielectricConstant: 2.25,
        diameterInner: 5,
        diameterOuter: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dimensions", field: "diameterOuter" }],
      },
      ok: false,
    }));

  it("rejects a non-positive inner diameter", () =>
    expect(
      runCoaxialCapacitancePerMeter({
        dielectricConstant: 2.25,
        diameterInner: 0,
        diameterOuter: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dimensions", field: "diameterOuter" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runCoaxialCapacitancePerMeter(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
