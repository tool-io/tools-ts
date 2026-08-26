import { describe, expect, it } from "vitest";
import { runSheetLoadMain, sheetLoadMainExample } from "./tool.js";

describe("Main Sheet Load Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runSheetLoadMain(sheetLoadMainExample.input)).toEqual({
      ok: true,
      output: { sheetLoadNewtons: 2750.7151796734324 },
    });
  });

  it("matches the sine divisor at forty five degrees", () => {
    expect(
      runSheetLoadMain({ mainAreaM2: 20, sheetAngleDeg: 45, windSpeedMs: 8 }),
    ).toEqual({
      ok: true,
      output: { sheetLoadNewtons: 1330.492119480608 },
    });
  });

  it("quadruples the load when wind speed doubles", () => {
    const base = runSheetLoadMain({
      mainAreaM2: 20,
      sheetAngleDeg: 20,
      windSpeedMs: 4,
    });
    const doubled = runSheetLoadMain({
      mainAreaM2: 20,
      sheetAngleDeg: 20,
      windSpeedMs: 8,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.sheetLoadNewtons).toBeCloseTo(
      Number(base.output.sheetLoadNewtons) * 4,
      12,
    );
  });

  it("rejects the exclusive lower boundary of five degrees with a stable code", () => {
    expect(
      runSheetLoadMain({ mainAreaM2: 20, sheetAngleDeg: 5, windSpeedMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "out_of_range", field: "sheetAngleDeg" }] },
      ok: false,
    });
  });

  it("rejects the exclusive upper boundary of ninety degrees with a stable code", () => {
    expect(
      runSheetLoadMain({
        mainAreaM2: 20,
        sheetAngleDeg: 89.999,
        windSpeedMs: 8,
      }).ok,
    ).toBe(true);
    expect(
      runSheetLoadMain({ mainAreaM2: 20, sheetAngleDeg: 90, windSpeedMs: 8 })
        .ok,
    ).toBe(false);
  });

  it("rejects zero or negative wind speed and sail area with stable errors", () => {
    expect(
      runSheetLoadMain({ mainAreaM2: 20, sheetAngleDeg: 20, windSpeedMs: -3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "windSpeedMs" }] },
      ok: false,
    });
    expect(
      runSheetLoadMain({ mainAreaM2: 0, sheetAngleDeg: 20, windSpeedMs: 8 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "mainAreaM2" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runSheetLoadMain({
        boomLengthMeters: 4,
        mainAreaM2: 20,
        sheetAngleDeg: 20,
        windSpeedMs: 8,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "boomLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runSheetLoadMain(null).ok).toBe(false);
    expect(runSheetLoadMain({}).ok).toBe(false);
  });
});
