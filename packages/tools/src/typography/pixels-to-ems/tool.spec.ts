import { describe, expect, it } from "vitest";
import { pixelsToEmsExample as example, runPixelsToEms } from "./tool.js";

describe("Pixels to Ems Converter", () => {
  it("executes its example and default root size", () => {
    expect(runPixelsToEms(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(runPixelsToEms({ pixelsPx: 32 })).toEqual({
      ok: true,
      output: { emValue: 2 },
    });
  });
  it("supports zero and signed CSS lengths", () => {
    expect(runPixelsToEms({ pixelsPx: 0 })).toEqual({
      ok: true,
      output: { emValue: 0 },
    });
    expect(runPixelsToEms({ pixelsPx: -30, rootFontSizePx: 20 })).toEqual({
      ok: true,
      output: { emValue: -1.5 },
    });
  });
  it("requires a positive root font size", () => {
    expect(runPixelsToEms({ pixelsPx: 16, rootFontSizePx: 0 }).ok).toBe(false);
  });
});
