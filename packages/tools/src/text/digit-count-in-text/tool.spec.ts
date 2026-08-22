import { describe, expect, it } from "vitest";
import { runDigitCountInText } from "./tool.js";

describe("Digit Count in Text Tool", () => {
  it("calculates a valid result", () => {
    expect(runDigitCountInText({ text: "Room 42, floor 7" })).toEqual({
      ok: true,
      output: { digitCount: 3 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDigitCountInText(null).ok).toBe(false));
});
