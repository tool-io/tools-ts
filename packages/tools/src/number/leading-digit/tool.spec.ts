import { describe, expect, it } from "vitest";
import { runLeadingDigit } from "./tool.js";

describe("Leading Digit Extractor", () => {
  it("calculates a valid result", () => {
    expect(runLeadingDigit({ value: 456 })).toEqual({
      ok: true,
      output: { leadingDigit: 4 },
    });
    expect(runLeadingDigit({ value: -952 })).toEqual({
      ok: true,
      output: { leadingDigit: 9 },
    });
  });

  it("rejects invalid input", () =>
    expect(runLeadingDigit(null).ok).toBe(false));
});
