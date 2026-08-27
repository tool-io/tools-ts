import { describe, expect, it } from "vitest";
import { qtcBazettExample, runQtcBazett } from "./tool.js";

describe("QTc Bazett", () => {
  it("publishes an executable example", () =>
    expect(runQtcBazett(qtcBazettExample.input)).toEqual({
      ok: true,
      output: qtcBazettExample.output,
    }));
  it("leaves the interval unchanged for a one second RR", () =>
    expect(runQtcBazett({ qtMs: 400, rrSeconds: 1 })).toEqual({
      ok: true,
      output: { correctedQtMs: 400 },
    }));
  it("corrects for a long RR interval", () =>
    expect(runQtcBazett({ qtMs: 360, rrSeconds: 1.2 })).toEqual({
      ok: true,
      output: { correctedQtMs: 328.63353450309967 },
    }));
  it("rejects zero QT interval", () => {
    const result = runQtcBazett({ qtMs: 0, rrSeconds: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero RR interval", () => {
    const result = runQtcBazett({ qtMs: 400, rrSeconds: 0 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative RR interval", () => {
    const result = runQtcBazett({ qtMs: 400, rrSeconds: -1 });
    expect(result.ok).toBe(false);
  });
});
