import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { calculateCrc32, crc32Example, crc32Tool } from "./tool.js";

describe("CRC-32 Checksum", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = crc32Tool.execute(crc32Example.input);
    expect(result).toEqual({ ok: true, output: crc32Example.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(crc32Tool.id).toBe("encode/crc32");
    expect(validateToolContract(crc32Tool)).toEqual([]);
  });

  it("matches known fixtures and the empty-string edge", () => {
    for (const [input, expected] of [
      ["The quick brown fox jumps over the lazy dog", "414FA339"],
      ["a", "E8B7BE43"],
      ["abc", "352441C2"],
    ] as const) {
      const result = calculateCrc32({ bytes: input });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.checksumHex).toBe(expected);
    }
    // The empty string is a legal CRC-32 input with checksum zero.
    expect(calculateCrc32({ bytes: "" })).toMatchObject({
      output: { checksumHex: "00000000" },
    });
  });

  it("rejects malformed probes", () => {
    expect(calculateCrc32(null).ok).toBe(false);
    expect(calculateCrc32({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateCrc32({ bytes: 42 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateCrc32({ extra: true, bytes: "x" })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
