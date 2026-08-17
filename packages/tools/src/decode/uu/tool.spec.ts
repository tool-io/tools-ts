import { describe, expect, it } from "vitest";
import {
  decodeUu,
  runUuDecoder,
  uuDecoderExample,
} from "./tool.js";

describe("Uudecoder", () => {
  it("decodes canonical uu bodies", () => {
    expect(decodeUu("")).toBe("");
    expect(decodeUu("!80  ")).toBe("a");
    expect(decodeUu("#86)C")).toBe("abc");
    expect(decodeUu("'5&]O;\"YI;P  ")).toBe("Tool.io");
  });
  it("accepts backtick zero groups and a trailing newline", () => {
    expect(decodeUu("'5&]O;\"YI;P``\n")).toBe("Tool.io");
  });
  it("rejects malformed bodies", () => {
    expect(runUuDecoder({ uu: "~86)C" }).ok).toBe(false);
    expect(runUuDecoder({ uu: "#86)" }).ok).toBe(false);
    expect(runUuDecoder({ uu: "`" }).ok).toBe(false);
    expect(runUuDecoder({ uu: "#86)C\n\n!80  " }).ok).toBe(false);
  });
  it("publishes an executable example", () =>
    expect(runUuDecoder(uuDecoderExample.input)).toEqual({
      ok: true,
      output: uuDecoderExample.output,
    }));
});
