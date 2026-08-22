import { describe, expect, it } from "vitest";
import { runRelativeLuminance } from "./tool.js";

describe("Relative Luminance Calculator", () => {
  it("returns zero for black", () => {
    expect(runRelativeLuminance({ blue: 0, green: 0, red: 0 })).toEqual({
      ok: true,
      output: { luminance: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runRelativeLuminance(null).ok).toBe(false));
});
