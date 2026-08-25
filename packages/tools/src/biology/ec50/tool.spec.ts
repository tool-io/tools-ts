import { describe, expect, it } from "vitest";
import { runEc50 } from "./tool.js";

describe("EC50 From Hill", () => {
  it("calculates a valid result", () =>
    expect(
      runEc50({
        concentrationAtResponse: 10,
        hillSlope: 1,
        responseFraction: 0.8,
      }),
    ).toEqual({ ok: true, output: { ec50Concentration: 2.5 } }));
  it("defaults the Hill slope to one", () =>
    expect(
      runEc50({ concentrationAtResponse: 4, responseFraction: 0.5 }),
    ).toEqual({ ok: true, output: { ec50Concentration: 4 } }));
  it("equals the concentration at half effect", () =>
    expect(
      runEc50({
        concentrationAtResponse: 7,
        hillSlope: 3,
        responseFraction: 0.5,
      }),
    ).toEqual({ ok: true, output: { ec50Concentration: 7 } }));
  it("flattens steep slopes toward the concentration", () =>
    expect(
      runEc50({
        concentrationAtResponse: 5,
        hillSlope: 100,
        responseFraction: 0.99,
      }),
    ).toEqual({
      ok: true,
      output: { ec50Concentration: 4.7754428540351155 },
    }));
  it("handles sub-half effects with slope two", () =>
    expect(
      runEc50({
        concentrationAtResponse: 10,
        hillSlope: 2,
        responseFraction: 0.9,
      }),
    ).toEqual({ ok: true, output: { ec50Concentration: 3.3333333333333344 } }));
  it("rejects non-positive concentrations", () => {
    const result = runEc50({
      concentrationAtResponse: 0,
      responseFraction: 0.8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_concentration");
  });
  it("rejects boundary effect fractions", () => {
    const result = runEc50({
      concentrationAtResponse: 10,
      responseFraction: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_response");
  });
  it("rejects non-positive Hill slopes", () => {
    const result = runEc50({
      concentrationAtResponse: 10,
      hillSlope: -2,
      responseFraction: 0.8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_slope");
  });
});
