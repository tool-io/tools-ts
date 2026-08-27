import { describe, expect, it } from "vitest";
import { reticulocyteCountExample, runReticulocyteCount } from "./tool.js";

describe("Absolute Reticulocytes", () => {
  it("publishes an executable example", () =>
    expect(runReticulocyteCount(reticulocyteCountExample.input)).toEqual({
      ok: true,
      output: reticulocyteCountExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runReticulocyteCount({ reticulocytePercent: 1, rbcMillionPerUl: 5 }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesPerUl: 50 } }));
  it("allows zero reticulocyte percentage", () =>
    expect(
      runReticulocyteCount({ reticulocytePercent: 0, rbcMillionPerUl: 5 }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesPerUl: 0 } }));
  it("handles the upper bound percentage", () =>
    expect(
      runReticulocyteCount({ reticulocytePercent: 100, rbcMillionPerUl: 5 }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesPerUl: 5000 } }));
  it("rejects percentage above one hundred", () => {
    const result = runReticulocyteCount({
      reticulocytePercent: 101,
      rbcMillionPerUl: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative percentage", () => {
    const result = runReticulocyteCount({
      reticulocytePercent: -1,
      rbcMillionPerUl: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero red cell count", () => {
    const result = runReticulocyteCount({
      reticulocytePercent: 2,
      rbcMillionPerUl: 0,
    });
    expect(result.ok).toBe(false);
  });
});
