import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLengthToPx, example } from "./tool.js";

describe("css/length-to-px", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateLengthToPx(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(
      tool.execute({
        length: "10vw",
        rootFontPx: 16,
        elementFontPx: 20,
        viewportWidthPx: 1200,
        viewportHeightPx: 800,
      }),
    ).toEqual({ ok: true, output: { pixels: 120 } });
  });
  it("rejects invalid case 2", () => {
    expect(
      tool.execute({
        length: "1cm",
        rootFontPx: 16,
        elementFontPx: 20,
        viewportWidthPx: 1200,
        viewportHeightPx: 800,
      }).ok,
    ).toBe(false);
  });
});
