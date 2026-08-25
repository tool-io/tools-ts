import { describe, expect, it } from "vitest";
import {
  cropWaterStressIndexExample,
  runCropWaterStressIndex,
} from "./tool.js";

describe("CWSI Calculator", () => {
  it("publishes an executable example", () =>
    expect(runCropWaterStressIndex(cropWaterStressIndexExample.input)).toEqual({
      ok: true,
      output: cropWaterStressIndexExample.output,
    }));
  it("returns zero at the wet reference temperature", () =>
    expect(
      runCropWaterStressIndex({
        canopyTempC: 22,
        dryReferenceTempC: 32,
        wetReferenceTempC: 22,
      }),
    ).toEqual({ ok: true, output: { cropWaterStressIndex: 0 } }));
  it("returns one at the dry reference temperature", () =>
    expect(
      runCropWaterStressIndex({
        canopyTempC: 32,
        dryReferenceTempC: 32,
        wetReferenceTempC: 22,
      }),
    ).toEqual({ ok: true, output: { cropWaterStressIndex: 1 } }));
  it("clamps canopy temperatures above the dry reference", () =>
    expect(
      runCropWaterStressIndex({
        canopyTempC: 40,
        dryReferenceTempC: 32,
        wetReferenceTempC: 22,
      }),
    ).toEqual({ ok: true, output: { cropWaterStressIndex: 1 } }));
  it("clamps canopy temperatures below the wet reference", () =>
    expect(
      runCropWaterStressIndex({
        canopyTempC: 15,
        dryReferenceTempC: 32,
        wetReferenceTempC: 22,
      }),
    ).toEqual({ ok: true, output: { cropWaterStressIndex: 0 } }));
  it("rejects matching reference temperatures", () => {
    const result = runCropWaterStressIndex({
      canopyTempC: 25,
      dryReferenceTempC: 28,
      wetReferenceTempC: 28,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_references");
  });
  it("rejects a dry reference below the wet reference", () => {
    const result = runCropWaterStressIndex({
      canopyTempC: 25,
      dryReferenceTempC: 20,
      wetReferenceTempC: 24,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_references");
  });
});
