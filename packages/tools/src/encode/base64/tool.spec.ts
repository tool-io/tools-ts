import { describe, expect, it } from "vitest";
import {
  base64EncoderExample,
  encodeBase64,
  runBase64Encoder,
} from "./tool.js";

describe("Base64 Encoder", () => {
  it("encodes ASCII and Unicode text", () => {
    expect(encodeBase64("Tool.io")).toBe("VG9vbC5pbw==");
    expect(encodeBase64("猫")).toBe("54yr");
  });
  it("publishes an executable example", () =>
    expect(runBase64Encoder(base64EncoderExample.input)).toEqual({
      ok: true,
      output: base64EncoderExample.output,
    }));
});
