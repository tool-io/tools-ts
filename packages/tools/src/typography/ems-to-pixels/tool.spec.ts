import { describe, expect, it } from "vitest";
import { emsToPixelsExample as example, runEmsToPixels } from "./tool.js";

describe("Ems to Pixels Converter", () => {
  it("executes its example and default root size", () => {
    expect(runEmsToPixels(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(runEmsToPixels({ emValue: 2 })).toEqual({
      ok: true,
      output: { pixels: 32 },
    });
  });
  it("supports zero and signed CSS lengths", () => {
    expect(runEmsToPixels({ emValue: 0 })).toEqual({
      ok: true,
      output: { pixels: 0 },
    });
    expect(runEmsToPixels({ emValue: -1.5, rootFontSizePx: 20 })).toEqual({
      ok: true,
      output: { pixels: -30 },
    });
  });
  it("requires a positive root font size", () => {
    expect(runEmsToPixels({ emValue: 1, rootFontSizePx: 0 }).ok).toBe(false);
  });
});
