import { describe, expect, it } from "vitest";
import {
  base64DecoderExample,
  decodeBase64,
  runBase64Decoder,
} from "./tool.js";

describe("Base64 Decoder", () => {
  it("decodes ASCII and Unicode text", () => {
    expect(decodeBase64("VG9vbC5pbw==")).toBe("Tool.io");
    expect(decodeBase64("54yr")).toBe("猫");
  });
  it("returns a structured error for invalid Base64", () =>
    expect(runBase64Decoder({ base64: "invalid" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase64Decoder(base64DecoderExample.input)).toEqual({
      ok: true,
      output: base64DecoderExample.output,
    }));
});
