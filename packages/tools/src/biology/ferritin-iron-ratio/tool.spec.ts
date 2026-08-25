import { describe, expect, it } from "vitest";
import { runFerritinIronRatio } from "./tool.js";

describe("Ferritin Per Iron Ratio", () => {
  it("divides ferritin by serum iron", () =>
    expect(
      runFerritinIronRatio({ ferritinNgMl: 60, serumIronUgdL: 50 }),
    ).toEqual({ ok: true, output: { ferritinIronRatio: 1.2 } }));
  it("keeps fractional ratios", () =>
    expect(
      runFerritinIronRatio({ ferritinNgMl: 400, serumIronUgdL: 150 }),
    ).toEqual({ ok: true, output: { ferritinIronRatio: 2.6666666666666665 } }));
  it("shrinks below one for low stores", () =>
    expect(
      runFerritinIronRatio({ ferritinNgMl: 12, serumIronUgdL: 48 }),
    ).toEqual({ ok: true, output: { ferritinIronRatio: 0.25 } }));
  it("yields zero without ferritin", () =>
    expect(
      runFerritinIronRatio({ ferritinNgMl: 0, serumIronUgdL: 90 }),
    ).toEqual({ ok: true, output: { ferritinIronRatio: 0 } }));
  it("rejects zero serum iron", () => {
    const result = runFerritinIronRatio({
      ferritinNgMl: 60,
      serumIronUgdL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects negative serum iron", () => {
    const result = runFerritinIronRatio({
      ferritinNgMl: 60,
      serumIronUgdL: -50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("serumIronUgdL");
  });
  it("rejects negative ferritin", () => {
    const result = runFerritinIronRatio({
      ferritinNgMl: -60,
      serumIronUgdL: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
