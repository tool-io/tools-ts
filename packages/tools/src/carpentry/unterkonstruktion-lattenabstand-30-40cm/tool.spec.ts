import { describe, expect, it } from "vitest";
import { battenSpacingExample, runBattenSpacing } from "./tool.js";

describe("Batten Spacing Rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBattenSpacing(battenSpacingExample.input)).toEqual({
      ok: true,
      output: battenSpacingExample.output,
    });
  });

  it("recommends forty centimetres at the nineteen millimetre threshold", () => {
    expect(runBattenSpacing({ boardThicknessMm: 19 })).toEqual({
      ok: true,
      output: { spacingCm: 40 },
    });
  });

  it("recommends thirty centimetres just below the threshold", () => {
    expect(runBattenSpacing({ boardThicknessMm: 18.5 })).toEqual({
      ok: true,
      output: { spacingCm: 30 },
    });
  });

  it("accepts the ten millimetre minimum", () => {
    expect(runBattenSpacing({ boardThicknessMm: 10 })).toEqual({
      ok: true,
      output: { spacingCm: 30 },
    });
  });

  it("accepts the sixty millimetre maximum", () => {
    expect(runBattenSpacing({ boardThicknessMm: 60 })).toEqual({
      ok: true,
      output: { spacingCm: 40 },
    });
  });

  it("rejects thickness below ten millimetres", () => {
    const result = runBattenSpacing({ boardThicknessMm: 9 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects thickness above sixty millimetres", () => {
    expect(runBattenSpacing({ boardThicknessMm: 60.5 }).ok).toBe(false);
  });

  it("requires the board thickness", () => {
    expect(runBattenSpacing({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runBattenSpacing({ boardThicknessMm: 24, extra: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runBattenSpacing(24).ok).toBe(false);
  });
});
