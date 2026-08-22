import { describe, expect, it } from "vitest";
import {
  binaryCodedDecimalDecodeExample,
  runBinaryCodedDecimalDecode,
} from "./tool.js";

describe("BCD Decoder", () => {
  it("runs the canonical example", () => {
    expect(
      runBinaryCodedDecimalDecode(binaryCodedDecimalDecodeExample.input),
    ).toEqual({
      ok: true,
      output: binaryCodedDecimalDecodeExample.output,
    });
  });

  it("calculates a valid result", () => {
    expect(runBinaryCodedDecimalDecode({ bcd: "0x12" })).toEqual({
      ok: true,
      output: { decimal: "12" },
    });
    expect(runBinaryCodedDecimalDecode({ bcd: "0x00200390" })).toEqual({
      ok: true,
      output: { decimal: "200390" },
    });
  });

  it("rejects invalid nibbles through execution", () => {
    expect(runBinaryCodedDecimalDecode({ bcd: "0xA5" })).toMatchObject({
      error: { issues: [{ code: "invalid_bcd_nibble" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runBinaryCodedDecimalDecode(null).ok).toBe(false));
});
