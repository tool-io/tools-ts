import { describe, expect, it } from "vitest";
import { mastBendAmountExample, runMastBendAmount } from "./tool.js";

describe("mast bend calculator", () => {
  it("reproduces its canonical example exactly with the default bend percentage", () => {
    expect(runMastBendAmount(mastBendAmountExample.input)).toEqual({
      ok: true,
      output: mastBendAmountExample.output,
    });
  });

  it("honors an explicit bend percentage", () => {
    expect(runMastBendAmount({ bendPercent: 5, mastHeightMeters: 15 })).toEqual(
      {
        ok: true,
        output: { bendMeters: 0.75 },
      },
    );
  });

  it("scales linearly with mast height", () => {
    expect(runMastBendAmount({ mastHeightMeters: 10 })).toEqual({
      ok: true,
      output: { bendMeters: 0.15 },
    });
  });

  it("returns zero bend at the lower percentage boundary", () => {
    const result = runMastBendAmount({ bendPercent: 0, mastHeightMeters: 15 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.bendMeters).toBe(0);
  });

  it("rejects negative bend percentages through validation", () => {
    for (const bendPercent of [-0.1, -1])
      expect(
        runMastBendAmount({ bendPercent, mastHeightMeters: 15 }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "bendPercent" }] },
        ok: false,
      });
  });

  it("rejects bend percentages above five through validation", () => {
    for (const bendPercent of [5.5, 100])
      expect(
        runMastBendAmount({ bendPercent, mastHeightMeters: 15 }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "bendPercent" }] },
        ok: false,
      });
  });

  it("rejects zero mast heights through calculation and negative heights through validation", () => {
    expect(runMastBendAmount({ mastHeightMeters: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "mastHeightMeters" }] },
      ok: false,
    });
    expect(runMastBendAmount({ mastHeightMeters: -15 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "mastHeightMeters" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runMastBendAmount({}).ok).toBe(false);
    expect(
      runMastBendAmount({ mastHeightMeters: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
    expect(runMastBendAmount(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
