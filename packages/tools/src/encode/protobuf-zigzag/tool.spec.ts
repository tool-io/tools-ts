import { describe, expect, it } from "vitest";
import { runZigzag } from "../../decode/zigzag/tool.js";
import { runProtobufZigzagEncode } from "./tool.js";

describe("Protobuf Zigzag Encoder", () => {
  it("maps n≥0 to 2n and n<0 to −2n−1", () => {
    expect(runProtobufZigzagEncode({ values: [0, -1, 1, -64] })).toEqual({
      ok: true,
      output: { codes: [0, 1, 2, 127] },
    });
  });

  it("round-trips through the zigzag decoder", () => {
    const values = [0, 5, -5, 12345, -12345];
    const encoded = runProtobufZigzagEncode({ values });
    if (!encoded.ok) throw new Error("expected success");
    const decoded = runZigzag({ codes: encoded.output.codes });
    expect(decoded).toEqual({ ok: true, output: { values, negativeCount: 2 } });
  });

  it("rejects invalid input", () =>
    expect(runProtobufZigzagEncode(null).ok).toBe(false));
});
