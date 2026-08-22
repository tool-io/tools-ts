import { describe, expect, it } from "vitest";
import { runGrayCodeEncode, grayCodeEncodeExample } from "./tool.js";
describe("gray code encoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGrayCodeEncode(grayCodeEncodeExample.input)).toEqual({
      ok: true,
      output: grayCodeEncodeExample.output,
    });
  });
  it("encodes zero as zero", () => {
    expect(runGrayCodeEncode({ value: 0 })).toEqual({
      ok: true,
      output: { grayCode: "0" },
    });
  });
});
