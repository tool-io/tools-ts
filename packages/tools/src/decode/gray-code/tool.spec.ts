import { describe, expect, it } from "vitest";
import { grayCodeDecodeExample, runGrayCodeDecode } from "./tool.js";
describe("gray code decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGrayCodeDecode(grayCodeDecodeExample.input)).toEqual({
      ok: true,
      output: grayCodeDecodeExample.output,
    });
  });
  it("decodes single bit correctly", () => {
    expect(runGrayCodeDecode({ grayCode: "1" })).toEqual({
      ok: true,
      output: { value: 1 },
    });
    expect(runGrayCodeDecode({ grayCode: "0" })).toEqual({
      ok: true,
      output: { value: 0 },
    });
  });
  it("decodes multi-bit codes by cumulative XOR", () => {
    expect(runGrayCodeDecode({ grayCode: "110" })).toEqual({
      ok: true,
      output: { value: 4 },
    });
    expect(runGrayCodeDecode({ grayCode: "1010" })).toEqual({
      ok: true,
      output: { value: 12 },
    });
    expect(runGrayCodeDecode({ grayCode: "1011" })).toEqual({
      ok: true,
      output: { value: 13 },
    });
  });
});
