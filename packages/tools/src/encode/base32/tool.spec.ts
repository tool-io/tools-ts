import { describe, expect, it } from "vitest";
import {
  base32EncoderExample,
  encodeBase32,
  runBase32Encoder,
} from "./tool.js";

describe("Base32 Encoder", () => {
  it("encodes RFC 4648 test vectors", () => {
    expect(encodeBase32("")).toBe("");
    expect(encodeBase32("f")).toBe("MY======");
    expect(encodeBase32("fo")).toBe("MZXQ====");
    expect(encodeBase32("foo")).toBe("MZXW6===");
    expect(encodeBase32("foob")).toBe("MZXW6YQ=");
    expect(encodeBase32("foobar")).toBe("MZXW6YTBOI======");
  });
  it("encodes ASCII and Unicode text", () => {
    expect(encodeBase32("Tool.io")).toBe("KRXW63BONFXQ====");
    expect(encodeBase32("猫")).toBe("46GKW===");
  });
  it("returns a structured error for missing text", () =>
    expect(runBase32Encoder({}).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase32Encoder(base32EncoderExample.input)).toEqual({
      ok: true,
      output: base32EncoderExample.output,
    }));
});
