import { describe, expect, it } from "vitest";
import { frameDoorBomExample, runFrameDoorBom } from "./tool.js";

describe("Frame Door Bill of Materials Generator", () => {
  it("publishes an executable example", () =>
    expect(runFrameDoorBom(frameDoorBomExample.input)).toEqual({
      ok: true,
      output: frameDoorBomExample.output,
    }));

  it.each([
    [
      {
        doorHeightMm: 2016,
        doorWidthMm: 496,
        railHeightMm: 104,
        stileWidthMm: 62,
      },
      { frameAreaM2: 0.32736, panelAreaM2: 0.672576 },
    ],
    [
      {
        doorHeightMm: 800,
        doorWidthMm: 401,
        railHeightMm: 50,
        stileWidthMm: 200,
      },
      { frameAreaM2: 0.3201, panelAreaM2: 0.0007 },
    ],
    [
      {
        doorHeightMm: 1995,
        doorWidthMm: 905,
        railHeightMm: 140,
        stileWidthMm: 105,
      },
      { frameAreaM2: 0.61355, panelAreaM2: 1.191925 },
    ],
  ])("calculates $frameAreaM2 m² frame for $input", (input, partial) =>
    expect(runFrameDoorBom(input)).toEqual({
      ok: true,
      output: { ...partial, railCount: 2, stileCount: 2 },
    }),
  );

  it("always reports two stiles and two rails", () => {
    const result = runFrameDoorBom({
      doorHeightMm: 2200,
      doorWidthMm: 760,
      railHeightMm: 120,
      stileWidthMm: 90,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.stileCount).toBe(2);
      expect(result.output.railCount).toBe(2);
    }
  });

  it("rejects a width at or below twice the stile width with invalid_dimensions", () => {
    for (const doorWidthMm of [160, 159]) {
      const result = runFrameDoorBom({
        doorHeightMm: 2000,
        doorWidthMm,
        railHeightMm: 100,
        stileWidthMm: 80,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
    }
  });

  it("rejects a height at or below twice the rail height with invalid_dimensions", () => {
    for (const doorHeightMm of [200, 150]) {
      const result = runFrameDoorBom({
        doorHeightMm,
        doorWidthMm: 600,
        railHeightMm: 100,
        stileWidthMm: 80,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
    }
  });

  it("rejects non-positive member dimensions with invalid_dimensions", () => {
    expect(
      runFrameDoorBom({
        doorHeightMm: 2000,
        doorWidthMm: 600,
        railHeightMm: 0,
        stileWidthMm: 80,
      }).ok,
    ).toBe(false);
    const negativeStile = runFrameDoorBom({
      doorHeightMm: 2000,
      doorWidthMm: 600,
      railHeightMm: 100,
      stileWidthMm: -80,
    });
    expect(negativeStile.ok).toBe(false);
    if (!negativeStile.ok)
      expect(negativeStile.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects non-positive door dimensions with invalid_dimensions", () => {
    expect(
      runFrameDoorBom({
        doorHeightMm: 0,
        doorWidthMm: 600,
        railHeightMm: 100,
        stileWidthMm: 80,
      }).ok,
    ).toBe(false);
    expect(
      runFrameDoorBom({
        doorHeightMm: 2000,
        doorWidthMm: -600,
        railHeightMm: 100,
        stileWidthMm: 80,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runFrameDoorBom({ doorHeightMm: 2000, doorWidthMm: 600 }).ok).toBe(
      false,
    );
  });

  it("rejects malformed and unknown inputs", () => {
    expect(
      runFrameDoorBom({
        doorHeightMm: Number.NaN,
        doorWidthMm: 600,
        railHeightMm: 100,
        stileWidthMm: 80,
      }).ok,
    ).toBe(false);
    expect(
      runFrameDoorBom({
        doorHeightMm: 2000,
        doorWidthMm: 600,
        extra: 1,
        railHeightMm: 100,
        stileWidthMm: 80,
      }).ok,
    ).toBe(false);
  });
});
