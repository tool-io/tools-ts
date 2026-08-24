import { describe, expect, it } from "vitest";
import { applyRot5, rot5Example, runRot5 } from "./tool.js";

describe("ROT5 Cipher", () => {
  it("matches the known transformation", () =>
    expect(applyRot5("0123456789")).toBe("5678901234"));
  it("publishes an executable example", () =>
    expect(runRot5(rot5Example.input)).toEqual({
      ok: true,
      output: rot5Example.output,
    }));
  it("wraps digits past nine", () =>
    expect(runRot5({ text: "9876" })).toEqual({
      ok: true,
      output: { result: "4321" },
    }));
  it("leaves non-digits unchanged", () =>
    expect(runRot5({ text: "Room 101, floor B!" })).toEqual({
      ok: true,
      output: { result: "Room 656, floor B!" },
    }));
  it("is its own inverse", () => {
    const input = "Release 42 in Q3!";
    expect(applyRot5(applyRot5(input))).toBe(input);
  });
  it("returns empty text unchanged", () =>
    expect(runRot5({ text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));
  it("preserves unicode characters", () =>
    expect(runRot5({ text: "世界7" })).toEqual({
      ok: true,
      output: { result: "世界2" },
    }));
  it("rejects missing text", () => expect(runRot5({}).ok).toBe(false));
  it("rejects non-string text", () =>
    expect(runRot5({ text: 42 }).ok).toBe(false));
  it("reports invalid_field for non-string text", () => {
    const outcome = runRot5({ text: 42 });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error.issues[0]?.code).toBe("invalid_field");
  });
});
