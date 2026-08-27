import { describe, expect, it } from "vitest";
import { qtcFridericiaExample, runQtcFridericia } from "./tool.js";

describe("QTc Fridericia", () => {
  it("publishes an executable example", () =>
    expect(runQtcFridericia(qtcFridericiaExample.input)).toEqual({
      ok: true,
      output: qtcFridericiaExample.output,
    }));
  it("leaves the interval unchanged for a one second RR", () =>
    expect(runQtcFridericia({ qtMs: 400, rrSeconds: 1 })).toEqual({
      ok: true,
      output: { correctedQtMs: 400 },
    }));
  it("uses the cube root of the RR interval", () =>
    expect(runQtcFridericia({ qtMs: 360, rrSeconds: 1.2 })).toEqual({
      ok: true,
      output: { correctedQtMs: 338.77297039717024 },
    }));
  it("rejects zero QT interval", () => {
    const result = runQtcFridericia({ qtMs: 0, rrSeconds: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero RR interval", () => {
    const result = runQtcFridericia({ qtMs: 400, rrSeconds: 0 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative QT interval", () => {
    const result = runQtcFridericia({ qtMs: -400, rrSeconds: 1 });
    expect(result.ok).toBe(false);
  });
});
