import { describe, expect, it } from "vitest";
import {
  protobufZigzagDecodeExample,
  runProtobufZigzagDecode,
} from "./tool.js";
describe("zigzag integer decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runProtobufZigzagDecode(protobufZigzagDecodeExample.input)).toEqual({
      ok: true,
      output: protobufZigzagDecodeExample.output,
    });
  });
  it("rejects negative codes", () => {
    expect(runProtobufZigzagDecode({ codes: [-1] }).ok).toBe(false);
  });
});
