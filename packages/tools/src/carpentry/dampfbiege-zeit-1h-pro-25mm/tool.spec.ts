import { describe, expect, it } from "vitest";
import {
  runSteamBendingTime,
  steamBendingTimeExample,
  steamBendingTimeTool,
} from "./tool.js";

describe("Steam Bending Time Calculator", () => {
  it("computes the canonical example", () =>
    expect(runSteamBendingTime(steamBendingTimeExample.input)).toEqual({
      ok: true,
      output: { steamHours: 2 },
    }));

  it.each([
    [25, 1],
    [100, 4],
    [19, 0.76],
    [6.25, 0.25],
    [1, 0.04],
  ])("steams %p mm stock for %p hours", (thicknessMm, expected) =>
    expect(runSteamBendingTime({ thicknessMm })).toEqual({
      ok: true,
      output: { steamHours: expected },
    }),
  );

  it("pro-rates thin stock below the 25 mm reference", () =>
    expect(runSteamBendingTime({ thicknessMm: 0.5 })).toEqual({
      ok: true,
      output: { steamHours: 0.02 },
    }));

  it("doubles the time when thickness doubles", () => {
    const thin = runSteamBendingTime({ thicknessMm: 20 });
    const thick = runSteamBendingTime({ thicknessMm: 40 });
    expect(thin.ok && thick.ok).toBe(true);
    if (thin.ok && thick.ok)
      expect((thick.output as { steamHours: number }).steamHours).toBe(
        2 * (thin.output as { steamHours: number }).steamHours,
      );
  });

  it("rejects zero and negative thickness", () => {
    const zero = runSteamBendingTime({ thicknessMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "thicknessMm",
        message: "Thickness must be positive.",
      });
    expect(runSteamBendingTime({ thicknessMm: -25 }).ok).toBe(false);
  });

  it("rejects a missing thickness", () => {
    const result = runSteamBendingTime({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "thicknessMm",
        message: "Thickness is invalid.",
      });
  });

  it("rejects non-finite thickness", () => {
    expect(runSteamBendingTime({ thicknessMm: Number.NaN }).ok).toBe(false);
    expect(
      runSteamBendingTime({ thicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric thickness", () =>
    expect(runSteamBendingTime({ thicknessMm: "25" } as never).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runSteamBendingTime({
      thicknessMm: 25,
      steamPressureBar: 1,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(steamBendingTimeExample))).toEqual(
      steamBendingTimeExample,
    );
    expect(steamBendingTimeTool.id).toBe(
      "carpentry/dampfbiege-zeit-1h-pro-25mm",
    );
    expect(steamBendingTimeTool.execution).toEqual({ kind: "pure" });
  });
});
