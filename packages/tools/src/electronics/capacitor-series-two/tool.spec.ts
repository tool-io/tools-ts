import { describe, expect, it } from "vitest";
import { runCapacitorSeriesTwo } from "./tool.js";
describe("Series Capacitors", () => {
  it("calculates a valid result", () =>
    expect(runCapacitorSeriesTwo({ c1F: 0.000003, c2F: 0.000006 })).toEqual({
      ok: true,
      output: { totalCapacitanceF: 0.000002 },
    }));
  it("matches equal capacitances", () =>
    expect(runCapacitorSeriesTwo({ c1F: 0.000002, c2F: 0.000002 })).toEqual({
      ok: true,
      output: { totalCapacitanceF: 0.000001 },
    }));
  it("rejects zero capacitance one", () => {
    const result = runCapacitorSeriesTwo({ c1F: 0, c2F: 0.000004 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "c1F",
      });
  });
  it("rejects negative capacitance two", () => {
    const result = runCapacitorSeriesTwo({ c1F: 0.000001, c2F: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "c2F",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runCapacitorSeriesTwo({ c1F: Number.POSITIVE_INFINITY, c2F: 1 }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runCapacitorSeriesTwo({ c1F: 1, c2F: 2, extra: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runCapacitorSeriesTwo({ c1F: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runCapacitorSeriesTwo({ c1F: "1", c2F: 2 }).ok).toBe(false));
});
