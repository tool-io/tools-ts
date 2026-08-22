import { describe, expect, it } from "vitest";
import { binaryToHexExample, runBinaryToHex } from "./tool.js";

describe("Binary to Hex Converter", () => {
  it("calculates the canonical example", () =>
    expect(runBinaryToHex(binaryToHexExample.input)).toEqual({
      ok: true,
      output: binaryToHexExample.output,
    }));

  it("pads short groups on the left", () =>
    expect(runBinaryToHex({ binary: "1" })).toEqual({
      ok: true,
      output: { hex: "1" },
    }));

  it("converts a full byte", () =>
    expect(runBinaryToHex({ binary: "10000000" })).toEqual({
      ok: true,
      output: { hex: "80" },
    }));

  it("converts sixteen bits", () =>
    expect(runBinaryToHex({ binary: "1111111111111111" })).toEqual({
      ok: true,
      output: { hex: "FFFF" },
    }));

  it("ignores spacing between groups", () =>
    expect(runBinaryToHex({ binary: "1101 0111" })).toEqual(
      runBinaryToHex({ binary: "11010111" }),
    ));

  it("converts zero", () =>
    expect(runBinaryToHex({ binary: "0000" })).toEqual({
      ok: true,
      output: { hex: "0" },
    }));

  it("rejects empty input", () => {
    const result = runBinaryToHex({ binary: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_binary");
  });

  it("rejects non-binary digits", () => {
    const result = runBinaryToHex({ binary: "11012" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_binary");
  });

  it("rejects missing input", () => expect(runBinaryToHex({}).ok).toBe(false));

  it("rejects unknown fields", () =>
    expect(runBinaryToHex({ binary: "1", extra: true }).ok).toBe(false));
});
