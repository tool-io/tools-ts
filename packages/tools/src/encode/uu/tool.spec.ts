import { describe, expect, it } from "vitest";
import {
  encodeUu,
  runUuEncoder,
  uuEncoderExample,
} from "./tool.js";

describe("Uuencoder", () => {
  it("encodes canonical uu bodies", () => {
    expect(encodeUu("")).toBe("");
    expect(encodeUu("a")).toBe("!80  ");
    expect(encodeUu("abc")).toBe("#86)C");
    expect(encodeUu("Tool.io")).toBe("'5&]O;\"YI;P  ");
  });
  it("splits lines at the configured byte count", () => {
    const lines = encodeUu("a".repeat(46)).split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]!.charCodeAt(0)).toBe(32 + 45);
  });
  it("rejects out-of-range line sizes", () =>
    expect(runUuEncoder({ text: "abc", lineBytes: 46 }).ok).toBe(false));
  it("returns a structured error for missing text", () =>
    expect(runUuEncoder({}).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runUuEncoder(uuEncoderExample.input)).toEqual({
      ok: true,
      output: uuEncoderExample.output,
    }));
});
