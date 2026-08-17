import { describe, expect, it } from "vitest";
import {
  base32DecoderExample,
  decodeBase32,
  runBase32Decoder,
} from "./tool.js";

describe("Base32 Decoder", () => {
  it("decodes RFC 4648 test vectors", () => {
    expect(decodeBase32("")).toBe("");
    expect(decodeBase32("MY======")).toBe("f");
    expect(decodeBase32("MZXQ====")).toBe("fo");
    expect(decodeBase32("MZXW6YQ=")).toBe("foob");
    expect(decodeBase32("MZXW6YTBOI======")).toBe("foobar");
  });
  it("decodes ASCII and Unicode text", () => {
    expect(decodeBase32("KRXW63BONFXQ====")).toBe("Tool.io");
    expect(decodeBase32("46GKW===")).toBe("猫");
  });
  it("rejects characters outside the Base32 alphabet", () =>
    expect(runBase32Decoder({ base32: "my======" }).ok).toBe(false));
  it("rejects misplaced padding", () =>
    expect(runBase32Decoder({ base32: "MZXW6=TB" }).ok).toBe(false));
  it("rejects incomplete blocks", () =>
    expect(runBase32Decoder({ base32: "MY=====" }).ok).toBe(false));
  it("rejects non-canonical trailing bits", () =>
    expect(runBase32Decoder({ base32: "MZ======" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase32Decoder(base32DecoderExample.input)).toEqual({
      ok: true,
      output: base32DecoderExample.output,
    }));
});
