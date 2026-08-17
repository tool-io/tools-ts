import { describe, expect, it } from "vitest";
import {
  base122EncoderExample,
  encodeBase122,
  runBase122Encoder,
} from "./tool.js";

describe("Base122 Encoder", () => {
  it("encodes reference artifacts", () => {
    expect(encodeBase122("")).toBe("");
    expect(encodeBase122("Hello")).toBe("$\u0019-Fc<");
    expect(encodeBase122("Tool.io")).toBe("*\u001bmva9Ro");
    expect(encodeBase122("foobar")).toBe("3\u001bmv\u0013\u0005d");
  });
  it("avoids the forbidden bytes in artifact text", () => {
    const artifact = encodeBase122('say "hi" & bye\\\n');
    for (const forbidden of ["\u0000", "\n", "\r", '"', "&", "\\"])
      expect(artifact.includes(forbidden)).toBe(false);
  });
  it("returns a structured error for missing text", () =>
    expect(runBase122Encoder({}).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runBase122Encoder(base122EncoderExample.input)).toEqual({
      ok: true,
      output: base122EncoderExample.output,
    }));
});
