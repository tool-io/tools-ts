import { describe, expect, it } from "vitest";
import {
  SILICON_DIOXIDE_K,
  calculateHighKDielectricEot,
  highKDielectricEotExample,
  runHighKDielectricEot,
} from "./tool.js";

describe("High-K EOT Calculator", () => {
  it("exposes the silicon dioxide permittivity constant", () => {
    expect(SILICON_DIOXIDE_K).toBe(3.9);
  });

  it("reproduces its canonical example exactly", () =>
    expect(runHighKDielectricEot(highKDielectricEotExample.input)).toEqual({
      ok: true,
      output: { equivalentOxideThicknessNm: 1.56 },
    }));

  it("maps a silicon nitride-like dielectric to its EOT", () =>
    expect(
      runHighKDielectricEot({ highKPermittivity: 7.8, highKThicknessNm: 20 }),
    ).toEqual({
      ok: true,
      output: { equivalentOxideThicknessNm: 10 },
    }));

  it("scales linearly with physical thickness", () =>
    expect(
      runHighKDielectricEot({ highKPermittivity: 25, highKThicknessNm: 5 }),
    ).toEqual({
      ok: true,
      output: { equivalentOxideThicknessNm: 0.78 },
    }));

  it("accepts a permittivity just above the boundary", () =>
    expect(
      runHighKDielectricEot({
        highKPermittivity: 3.9000001,
        highKThicknessNm: 3.9,
      }),
    ).toEqual({
      ok: true,
      output: { equivalentOxideThicknessNm: 3.8999999000000023 },
    }));

  it("returns physical thickness for silicon dioxide itself", () =>
    expect(
      calculateHighKDielectricEot({
        highKPermittivity: 3.9,
        highKThicknessNm: 10,
      }),
    ).toEqual({ equivalentOxideThicknessNm: 10 }));

  it("returns a larger EOT for a lower-permittivity dielectric", () =>
    expect(
      calculateHighKDielectricEot({
        highKPermittivity: 1.95,
        highKThicknessNm: 10,
      }),
    ).toEqual({ equivalentOxideThicknessNm: 20 }));

  it("rejects zero permittivity", () =>
    expect(
      runHighKDielectricEot({
        highKPermittivity: 0,
        highKThicknessNm: 10,
      }),
    ).toMatchObject({ ok: false }));

  it("rejects zero thickness", () =>
    expect(
      runHighKDielectricEot({ highKPermittivity: 25, highKThicknessNm: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "highKThicknessNm" }],
      },
      ok: false,
    }));

  it("rejects negative thickness", () =>
    expect(
      runHighKDielectricEot({ highKPermittivity: 25, highKThicknessNm: -10 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "highKThicknessNm" }],
      },
      ok: false,
    }));

  it("rejects non-finite permittivity", () =>
    expect(
      runHighKDielectricEot({
        highKPermittivity: Number.NaN,
        highKThicknessNm: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "highKPermittivity" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runHighKDielectricEot({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "highKPermittivity" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runHighKDielectricEot({
        extra: 1,
        highKPermittivity: 25,
        highKThicknessNm: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
