import { describe, expect, it } from "vitest";
import { runPrimerGcClamp } from "./tool.js";

describe("GC Clamp Check", () => {
  it("calculates a valid result", () =>
    expect(runPrimerGcClamp({ sequence: "ACGATCGG" })).toEqual({
      ok: true,
      output: { gcClampOk: true, terminalGcCount: 3 },
    }));
  it("accepts two terminal GC bases", () =>
    expect(runPrimerGcClamp({ sequence: "ACGTACGT" })).toEqual({
      ok: true,
      output: { gcClampOk: true, terminalGcCount: 2 },
    }));
  it("rejects five terminal GC bases", () =>
    expect(runPrimerGcClamp({ sequence: "ACGCCGGGG" })).toEqual({
      ok: true,
      output: { gcClampOk: false, terminalGcCount: 5 },
    }));
  it("rejects no terminal GC bases", () =>
    expect(runPrimerGcClamp({ sequence: "AAAAAAAAAA" })).toEqual({
      ok: true,
      output: { gcClampOk: false, terminalGcCount: 0 },
    }));
  it("rejects non-DNA characters", () => {
    const result = runPrimerGcClamp({ sequence: "ACGU" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
