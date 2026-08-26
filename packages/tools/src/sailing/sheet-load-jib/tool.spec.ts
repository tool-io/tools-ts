import { describe, expect, it } from "vitest";
import { runSheetLoadJib, sheetLoadJibExample } from "./tool.js";

describe("Jib Sheet Load Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runSheetLoadJib(sheetLoadJibExample.input)).toEqual({
      ok: true,
      output: { sheetLoadNewtons: 1375.3575898367162 },
    });
  });

  it("scales with the square of wind speed", () => {
    expect(
      runSheetLoadJib({ jibAreaM2: 10, sheetAngleDeg: 45, windSpeedMs: 8 }),
    ).toEqual({
      ok: true,
      output: { sheetLoadNewtons: 665.246059740304 },
    });
  });

  it("doubles the load when sail area doubles", () => {
    const base = runSheetLoadJib({
      jibAreaM2: 10,
      sheetAngleDeg: 20,
      windSpeedMs: 8,
    });
    const doubled = runSheetLoadJib({
      jibAreaM2: 20,
      sheetAngleDeg: 20,
      windSpeedMs: 8,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.sheetLoadNewtons).toBeCloseTo(
      Number(base.output.sheetLoadNewtons) * 2,
      12,
    );
  });

  it("rejects the exclusive lower boundary of five degrees with a stable code", () => {
    expect(
      runSheetLoadJib({ jibAreaM2: 10, sheetAngleDeg: 5, windSpeedMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "out_of_range", field: "sheetAngleDeg" }] },
      ok: false,
    });
  });

  it("rejects the exclusive upper boundary of ninety degrees with a stable code", () => {
    expect(
      runSheetLoadJib({ jibAreaM2: 10, sheetAngleDeg: 90, windSpeedMs: 8 }).ok,
    ).toBe(false);
  });

  it("rejects an angle outside the schema bounds", () => {
    expect(
      runSheetLoadJib({ jibAreaM2: 10, sheetAngleDeg: 120, windSpeedMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "sheetAngleDeg" }] },
      ok: false,
    });
  });

  it("rejects zero or negative wind speed and sail area with stable errors", () => {
    expect(
      runSheetLoadJib({ jibAreaM2: 10, sheetAngleDeg: 20, windSpeedMs: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "windSpeedMs" }] },
      ok: false,
    });
    expect(
      runSheetLoadJib({ jibAreaM2: -1, sheetAngleDeg: 20, windSpeedMs: 8 }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runSheetLoadJib({
        jibAreaM2: 10,
        luffLengthMeters: 9,
        sheetAngleDeg: 20,
        windSpeedMs: 8,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "luffLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runSheetLoadJib(null).ok).toBe(false);
    expect(runSheetLoadJib({}).ok).toBe(false);
  });
});
