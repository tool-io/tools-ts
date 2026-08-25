import { describe, expect, it } from "vitest";
import { runAbsoluteReticulocyteCount } from "./tool.js";

describe("ARC From Percent", () => {
  it("multiplies percent, RBC count and ten", () =>
    expect(
      runAbsoluteReticulocyteCount({
        rbcMillionPerUl: 5,
        reticulocytePercent: 2,
      }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesKPerUl: 100 } }));
  it("handles fractional RBC counts", () =>
    expect(
      runAbsoluteReticulocyteCount({
        rbcMillionPerUl: 4.25,
        reticulocytePercent: 3,
      }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesKPerUl: 127.5 } }));
  it("yields zero without reticulocytes", () =>
    expect(
      runAbsoluteReticulocyteCount({
        rbcMillionPerUl: 5,
        reticulocytePercent: 0,
      }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesKPerUl: 0 } }));
  it("scales to the upper reticulocyte bound", () =>
    expect(
      runAbsoluteReticulocyteCount({
        rbcMillionPerUl: 0.5,
        reticulocytePercent: 100,
      }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesKPerUl: 500 } }));
  it("returns zero for a zero RBC count", () =>
    expect(
      runAbsoluteReticulocyteCount({
        rbcMillionPerUl: 0,
        reticulocytePercent: 2,
      }),
    ).toEqual({ ok: true, output: { absoluteReticulocytesKPerUl: 0 } }));
  it("rejects negative reticulocyte percents", () => {
    const result = runAbsoluteReticulocyteCount({
      rbcMillionPerUl: 5,
      reticulocytePercent: -2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("reticulocytePercent");
  });
  it("rejects reticulocyte percents above one hundred", () => {
    const result = runAbsoluteReticulocyteCount({
      rbcMillionPerUl: 5,
      reticulocytePercent: 101,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
