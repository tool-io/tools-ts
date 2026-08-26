import { describe, expect, it } from "vitest";
import { runVangTension, vangTensionExample } from "./tool.js";

describe("vang tension guide", () => {
  it("reproduces its canonical example exactly with the default max wind", () => {
    expect(runVangTension(vangTensionExample.input)).toEqual({
      ok: true,
      output: vangTensionExample.output,
    });
  });

  it("clamps to ten percent in calm air at the zero boundary", () => {
    expect(runVangTension({ windSpeedKt: 0 })).toEqual({
      ok: true,
      output: { vangTensionPercent: 10 },
    });
  });

  it("reaches one hundred percent when wind equals the default max wind", () => {
    expect(runVangTension({ windSpeedKt: 25 })).toEqual({
      ok: true,
      output: { vangTensionPercent: 100 },
    });
  });

  it("clamps beyond one hundred percent in wind over the default max", () => {
    expect(runVangTension({ windSpeedKt: 60 })).toEqual({
      ok: true,
      output: { vangTensionPercent: 100 },
    });
  });

  it("honors a custom max wind", () => {
    expect(runVangTension({ maxWindKt: 60, windSpeedKt: 30 })).toEqual({
      ok: true,
      output: { vangTensionPercent: 50 },
    });
  });

  it("rejects negative wind through validation", () => {
    expect(runVangTension({ windSpeedKt: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "windSpeedKt" }] },
      ok: false,
    });
  });

  it("rejects max winds outside ten to sixty through validation", () => {
    for (const maxWindKt of [9, 61])
      expect(runVangTension({ maxWindKt, windSpeedKt: 10 })).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "maxWindKt" }] },
        ok: false,
      });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runVangTension({}).ok).toBe(false);
    expect(runVangTension({ windSpeedKt: Number.NaN }).ok).toBe(false);
    expect(runVangTension(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required", field: "" }] },
      ok: false,
    });
  });
});
