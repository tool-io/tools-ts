import { describe, expect, it } from "vitest";
import {
  frameRoughOpeningExample,
  frameRoughOpeningTool,
  runFrameRoughOpening,
} from "./tool.js";

describe("Frame Rough Opening Calculator", () => {
  it("computes the canonical example", () =>
    expect(runFrameRoughOpening(frameRoughOpeningExample.input)).toEqual({
      ok: true,
      output: { roughOpeningHeightMm: 2020, roughOpeningWidthMm: 860 },
    }));

  it("adds exactly 10 mm width and 5 mm height", () =>
    expect(
      runFrameRoughOpening({
        doorAssemblyHeightMm: 1000,
        doorAssemblyWidthMm: 500,
      }),
    ).toEqual({
      ok: true,
      output: { roughOpeningHeightMm: 1005, roughOpeningWidthMm: 510 },
    }));

  it("keeps fractional assembly dimensions", () =>
    expect(
      runFrameRoughOpening({
        doorAssemblyHeightMm: 2015.5,
        doorAssemblyWidthMm: 850.25,
      }),
    ).toEqual({
      ok: true,
      output: { roughOpeningHeightMm: 2020.5, roughOpeningWidthMm: 860.25 },
    }));

  it("rejects a zero door assembly width", () => {
    const result = runFrameRoughOpening({
      doorAssemblyHeightMm: 2015,
      doorAssemblyWidthMm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects a negative door assembly height", () => {
    const result = runFrameRoughOpening({
      doorAssemblyHeightMm: -2015,
      doorAssemblyWidthMm: 850,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.field).toBe("doorAssemblyHeightMm");
  });

  it("rejects non-finite inputs", () => {
    expect(
      runFrameRoughOpening({
        doorAssemblyHeightMm: Number.NaN,
        doorAssemblyWidthMm: 850,
      }).ok,
    ).toBe(false);
    expect(
      runFrameRoughOpening({
        doorAssemblyHeightMm: 2015,
        doorAssemblyWidthMm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects a missing width", () => {
    const result = runFrameRoughOpening({ doorAssemblyHeightMm: 2015 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing height", () =>
    expect(runFrameRoughOpening({ doorAssemblyWidthMm: 850 }).ok).toBe(false));

  it("rejects non-numeric inputs", () =>
    expect(
      runFrameRoughOpening({
        doorAssemblyHeightMm: "2015",
        doorAssemblyWidthMm: 850,
      } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runFrameRoughOpening({
      doorAssemblyHeightMm: 2015,
      doorAssemblyWidthMm: 850,
      wallThicknessMm: 115,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(frameRoughOpeningExample))).toEqual(
      frameRoughOpeningExample,
    );
    expect(frameRoughOpeningTool.id).toBe(
      "carpentry/zarge-maueroeffnung-plus10mm-breite-plus5mm-hoehe",
    );
    expect(frameRoughOpeningTool.execution).toEqual({ kind: "pure" });
    expect(frameRoughOpeningTool.outputSchema.required).toEqual([
      "roughOpeningWidthMm",
      "roughOpeningHeightMm",
    ]);
  });
});
