import { describe, expect, it } from "vitest";
import { runSailAspectRatioMain, sailAspectRatioMainExample } from "./tool.js";

describe("Main Aspect Ratio", () => {
  it("calculates the canonical example", () =>
    expect(runSailAspectRatioMain(sailAspectRatioMainExample.input)).toEqual({
      ok: true,
      output: sailAspectRatioMainExample.output,
    }));
  it("rewards taller narrower sails with higher ratios", () =>
    expect(
      runSailAspectRatioMain({ luffLengthMeters: 10, mainsailAreaM2: 25 }),
    ).toEqual({ ok: true, output: { aspectRatio: 4 } }));
  it("halves the ratio when area doubles", () =>
    expect(
      runSailAspectRatioMain({ luffLengthMeters: 12, mainsailAreaM2: 72 }),
    ).toEqual({ ok: true, output: { aspectRatio: 2 } }));
  it("squares the luff in the numerator", () =>
    expect(
      runSailAspectRatioMain({ luffLengthMeters: 6, mainsailAreaM2: 36 }),
    ).toEqual({ ok: true, output: { aspectRatio: 1 } }));
  it("rejects non-positive luff length", () => {
    const result = runSailAspectRatioMain({
      luffLengthMeters: 0,
      mainsailAreaM2: 36,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_luff");
  });
  it("rejects non-positive mainsail area", () => {
    const result = runSailAspectRatioMain({
      luffLengthMeters: 12,
      mainsailAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });
  it("rejects negative inputs", () =>
    expect(
      runSailAspectRatioMain({ luffLengthMeters: -12, mainsailAreaM2: 36 }).ok,
    ).toBe(false));
  it("rejects missing and malformed input", () => {
    expect(runSailAspectRatioMain({}).ok).toBe(false);
    expect(
      runSailAspectRatioMain({
        luffLengthMeters: "12",
        mainsailAreaM2: 36,
      }).ok,
    ).toBe(false);
    expect(runSailAspectRatioMain(null).ok).toBe(false);
  });
});
