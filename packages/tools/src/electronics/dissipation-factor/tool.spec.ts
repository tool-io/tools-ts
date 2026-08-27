import { describe, expect, it } from "vitest";
import {
  calculateDissipationFactor,
  dissipationFactorExample,
  runDissipationFactor,
} from "./tool.js";

describe("Dissipation Factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDissipationFactor(dissipationFactorExample.input)).toEqual({
      ok: true,
      output: dissipationFactorExample.output,
    });
  });

  it("equals one over Q for a matched pair", () => {
    const df = calculateDissipationFactor({
      esrOhms: 2,
      xcOhms: 200,
    }).dissipationFactor;
    expect(df).toBe(0.01);
    expect(1 / df).toBe(100);
  });

  it("shrinks as reactance grows at fixed ESR", () => {
    const small = calculateDissipationFactor({
      esrOhms: 1,
      xcOhms: 500,
    }).dissipationFactor;
    const large = calculateDissipationFactor({
      esrOhms: 1,
      xcOhms: 1000,
    }).dissipationFactor;
    expect(large).toBeLessThan(small);
  });

  it("handles negative capacitive reactance by sign symmetry", () => {
    expect(
      calculateDissipationFactor({ esrOhms: 1, xcOhms: -100 })
        .dissipationFactor,
    ).toBe(-0.01);
  });

  it("rejects zero reactance via must_be_nonzero", () => {
    expect(runDissipationFactor({ esrOhms: 1, xcOhms: 0 })).toMatchObject({
      error: { issues: [{ code: "must_be_nonzero", field: "xcOhms" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runDissipationFactor({
        ...dissipationFactorExample.input,
        tanDelta: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "tanDelta" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runDissipationFactor({ xcOhms: 100 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "esrOhms" }] },
      ok: false,
    });
  });
});
