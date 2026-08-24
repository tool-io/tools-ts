import { describe, expect, it } from "vitest";
import {
  RHO_COPPER_OHM_M,
  runTsvResistance,
  tsvResistanceExample,
} from "./tool.js";

describe("TSV Resistance Calculator", () => {
  it("exposes the copper resistivity constant", () => {
    expect(RHO_COPPER_OHM_M).toBe(1.68e-8);
  });

  it("reproduces its canonical example exactly", () =>
    expect(runTsvResistance(tsvResistanceExample.input)).toEqual({
      ok: true,
      output: tsvResistanceExample.output,
    }));

  it("lands in the tens of milliohms for a typical via", () => {
    const result = runTsvResistance(tsvResistanceExample.input);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.resistanceMilliohms).toBeGreaterThan(10);
    expect(result.output.resistanceMilliohms).toBeLessThan(100);
  });

  it("doubles with via height", () =>
    expect(
      runTsvResistance({ ...tsvResistanceExample.input, heightUm: 100 }),
    ).toEqual({
      ok: true,
      output: { resistanceMilliohms: 85.56169740620295 },
    }));

  it("drops by four when the radius doubles", () =>
    expect(
      runTsvResistance({ ...tsvResistanceExample.input, radiusUm: 5 }),
    ).toMatchObject({
      ok: true,
      output: { resistanceMilliohms: 10.695212175775369 },
    }));

  it("rejects zero height with a stable code", () =>
    expect(
      runTsvResistance({ ...tsvResistanceExample.input, heightUm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_height", field: "heightUm" }] },
      ok: false,
    }));

  it("rejects zero radius with a stable code", () =>
    expect(
      runTsvResistance({ ...tsvResistanceExample.input, radiusUm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_radius", field: "radiusUm" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runTsvResistance({
        ...tsvResistanceExample.input,
        heightUm: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "heightUm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runTsvResistance({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "heightUm" }] },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runTsvResistance({ ...tsvResistanceExample.input, extra: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
