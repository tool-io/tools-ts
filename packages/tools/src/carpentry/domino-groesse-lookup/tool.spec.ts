import { describe, expect, it } from "vitest";
import { dominoSizeLookupExample, runDominoSizeLookup } from "./tool.js";

describe("Domino Size Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDominoSizeLookup(dominoSizeLookupExample.input)).toEqual({
      ok: true,
      output: dominoSizeLookupExample.output,
    });
  });

  it("looks up the smallest size", () => {
    expect(runDominoSizeLookup({ size: "4x20" })).toEqual({
      ok: true,
      output: { tenonLengthMm: 20, tenonThicknessMm: 4 },
    });
  });

  it("looks up the largest size", () => {
    expect(runDominoSizeLookup({ size: "14x140" })).toEqual({
      ok: true,
      output: { tenonLengthMm: 140, tenonThicknessMm: 14 },
    });
  });

  it("covers every documented size via its map literal", () => {
    for (const size of [
      "4x20",
      "5x30",
      "6x40",
      "8x40",
      "8x50",
      "8x80",
      "10x50",
      "10x80",
      "10x100",
      "12x100",
      "12x140",
      "14x100",
      "14x140",
    ] as const) {
      const result = runDominoSizeLookup({ size });
      expect(result.ok).toBe(true);
    }
  });

  it("distinguishes sizes that share a length", () => {
    expect(runDominoSizeLookup({ size: "12x100" })).toEqual({
      ok: true,
      output: { tenonLengthMm: 100, tenonThicknessMm: 12 },
    });
    expect(runDominoSizeLookup({ size: "10x50" })).toEqual({
      ok: true,
      output: { tenonLengthMm: 50, tenonThicknessMm: 10 },
    });
  });

  it("rejects unknown sizes", () => {
    const result = runDominoSizeLookup({ size: "6x30" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("size");
  });

  it("rejects differently formatted sizes", () => {
    expect(runDominoSizeLookup({ size: "8X40" }).ok).toBe(false);
  });

  it("requires the size", () => {
    expect(runDominoSizeLookup({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDominoSizeLookup({ extra: true, size: "5x30" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
