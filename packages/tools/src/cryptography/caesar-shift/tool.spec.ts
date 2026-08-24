import { describe, expect, it } from "vitest";
import { caesarShiftExample, runCaesarShift, shiftLatinText } from "./tool.js";

describe("Caesar Shift Cipher", () => {
  it("matches the known transformation", () =>
    expect(shiftLatinText("Hello, World!", 3)).toBe("Khoor, Zruog!"));
  it("publishes an executable example", () =>
    expect(runCaesarShift(caesarShiftExample.input)).toEqual({
      ok: true,
      output: caesarShiftExample.output,
    }));
  it("defaults to a shift of three", () =>
    expect(runCaesarShift({ text: "abc" })).toEqual({
      ok: true,
      output: { result: "def" },
    }));
  it("wraps letters around the alphabet", () =>
    expect(runCaesarShift({ shift: 3, text: "xyzXYZ" })).toEqual({
      ok: true,
      output: { result: "abcABC" },
    }));
  it("decodes with negative shifts", () =>
    expect(
      runCaesarShift({ shift: -5, text: shiftLatinText("Attack at dawn!", 5) }),
    ).toEqual({
      ok: true,
      output: { result: "Attack at dawn!" },
    }));
  it("wraps with extreme negative shifts", () =>
    expect(runCaesarShift({ shift: -25, text: "bcdBCD" })).toEqual({
      ok: true,
      output: { result: "cdeCDE" },
    }));
  it("leaves non-letters unchanged", () =>
    expect(runCaesarShift({ shift: 1, text: "a-b_c 42!" })).toEqual({
      ok: true,
      output: { result: "b-c_d 42!" },
    }));
  it("is its own inverse for opposite shifts", () => {
    const input = "The quick brown fox jumps over 13 lazy dogs!";
    expect(shiftLatinText(shiftLatinText(input, 11), -11)).toBe(input);
  });
  it("normalizes arbitrary direct shifts in both directions", () => {
    expect(shiftLatinText("Az", -27)).toBe("Zy");
    expect(shiftLatinText("Az", 53)).toBe("Ba");
  });
  it("returns empty text unchanged", () =>
    expect(runCaesarShift({ shift: 7, text: "" })).toEqual({
      ok: true,
      output: { result: "" },
    }));
  it("rejects shifts beyond the range", () =>
    expect(runCaesarShift({ shift: 26, text: "a" }).ok).toBe(false));
  it("rejects non-integer shifts", () => {
    const outcome = runCaesarShift({ shift: 1.5, text: "a" });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error.issues[0]?.code).toBe("invalid_field");
  });
  it("reports unknown_field for unexpected inputs", () => {
    const outcome = runCaesarShift({
      shift: 3,
      text: "a",
      rotation: 4,
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error.issues[0]?.code).toBe("unknown_field");
  });
});
