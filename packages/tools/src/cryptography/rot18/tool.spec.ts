import { describe, expect, it } from "vitest";
import { applyRot18, rot18Example, runRot18 } from "./tool.js";

describe("ROT18 Cipher", () => {
  it("matches the known transformation", () =>
    expect(applyRot18("Hello123")).toBe("Uryyb678"));
  it("publishes an executable example", () =>
    expect(runRot18(rot18Example.input)).toEqual({
      ok: true,
      output: rot18Example.output,
    }));
  it("wraps letters from z to m", () =>
    expect(runRot18({ text: "zZ" })).toEqual({
      ok: true,
      output: { result: "mM" },
    }));
  it("wraps digits from 9 to 4", () =>
    expect(runRot18({ text: "9" })).toEqual({
      ok: true,
      output: { result: "4" },
    }));
  it("is its own inverse", () => {
    const input = "Meet at gate 7!";
    expect(applyRot18(applyRot18(input))).toBe(input);
  });
  it("leaves other characters unchanged", () =>
    expect(runRot18({ text: "a-b_c @9!" })).toEqual({
      ok: true,
      output: { result: "n-o_p @4!" },
    }));
  it("preserves case separately", () =>
    expect(runRot18({ text: "abcABC" })).toEqual({
      ok: true,
      output: { result: "nopNOP" },
    }));
  it("handles mixed content", () =>
    expect(runRot18({ text: "Password99 is safe." })).toEqual({
      ok: true,
      output: { result: "Cnffjbeq44 vf fnsr." },
    }));
  it("returns empty text unchanged", () =>
    expect(runRot18({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));
  it("rejects missing text", () => expect(runRot18({}).ok).toBe(false));
  it("reports invalid_field for non-string text", () => {
    const outcome = runRot18({ text: null });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error.issues[0]?.code).toBe("invalid_field");
  });
});
